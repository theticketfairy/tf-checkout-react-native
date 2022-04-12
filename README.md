# tf-checkout-react-native

React Native library for Ticket Fairy checkout.

# Requirements

Configure [ReactNative environment](https://reactnative.dev/docs/environment-setup) for desired platforms (iOS, Android or both).

### React Native

- Suggested ReactNative version `0.66.3`
- Suggested Flipper version `0.66`
- React version `0.17.1`

### Android

- Android 5.0 (API level 21) and above
- Gradle plugin version `4.2.2`
- Gradle version `6.7.1`
- Compile Sdk Version and Target Sdk Version `30`
- Build Tools Version `30.0.2`
- Java version `1.8`
- Kotlin version `1.5.31`

Add the following to your Android Manifest as activity property.

To download the PDFs, add the `WRITE_EXTERNAL_STORAGE` permission to the Android's Manifest file.

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### iOS

- Compatible with apps targeting iOS 11 or above.
- Pods version `1.10.1`
- Command Line Tools version `13.0`

To download the PDFs, add the following flags to `Info.plist` file:

```
- UIFileSharingEnabled: Application supports iTunes file sharing
- LSSupportsOpeningDocumentsInPlace: Supports opening documents in place
```

# Installation

```sh
yarn add tf-checkout-react-native
```

or

```sh
npm install tf-checkout-react-native
```

Make sure to install all the required dependencies in your project.

### Required for Android

Add below dependency to your `app/build.gradle` file with specified version (in our example we are using `1.4.0`).

```java
implementation 'com.google.android.material:material:<version>'
```

Set appropriate style in your styles.xml file.

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.DayNight.NoActionBar">
  <!-- ... -->
</style>
```

# Set your configuration

Import the function from the library.

```js
import { setConfig } from 'tf-checkout-react-native'
```

Use it in your initial useEffect function:

```js
useEffect(() => {
  setConfig({
    DOMAIN: 'https://yourdomain.mx',
  })
}, [])
```

`setConfig` set your event's configuration, with the following options:

```js
{
  DOMAIN?: string,
  ENV?: 'PROD' | 'DEV' | 'STAG',
  CLIENT_ID?: string,
  CLIENT_SECRET?: string,
  TIMEOUT?: number,
  BRAND?: string,
  ARE_SUB_BRANDS_INCLUDED?: boolean
}
```
### Props
| Property | Description |
| -------- | ----------- |
| DOMAIN | Specify your domains name example: `https://google.com` this is important to maintain cart session active and prevent it from expiring when user login in the BillingInfo component. |
| ENV | Sets the environment to any of the following environments: Production, Staging or Development. Receives the following values: `PROD`, `DEV`, `STAG`. Defaults to `PROD`.|
| CLIENT_ID | Set your CLIENT_ID. |
| CLIENT_SECRET | Set your CLIENT_SECRET. |
| BRAND | Set your BRAND so users can only see this brand in their orders. |
| TIMEOUT | Set custom timeout for the APIs requests. |
| ARE_SUB_BRANDS_INCLUDED | If true will include orders from the `BRAND` sub-brands. Default `false`. |

# Run the example app

1. Clone this repo.
2. In the App.tsx file, update the `EVENT_ID` const with the assigned ID to be able to retrieve data from the server.
3. cd into the _root project_ folder and `yarn` or `npm install`.
4. cd into the _example_ folder and `yarn` or `npm install`.
   - If running on iOS, cd into ios folder and `pod install && cd ..`.
5. Run `yarn ios` or `npm run ios` to initialize and run in the iPhone simulator.
6. If running on Android, run `yarn android` or `npm run android` to run it in the Android emulator or connected physical device.

# Features [🚧 WIP 🚧]

This library exports the following components:

### Login

Used to authenticate the user.

### Tickets

Will retrieve and show a list of tickets corresponding to `eventId`. It also includes a PromoCode component that validates it and updates the tickets list.

User can select what ticket type wants to buy and the quantity of tickets.

### Billing information

User will need to enter its data into a form to create a Ticket Fairy account. Also, depending on the number of tickets selected, will need to fill the information of each one of them.

### Checkout

Will show the order details and a card form that the user will need to fill with its card details.

TicketFairy doesn't store any card related data, we use [Stripe](https://stripe.com/) as payments solution.

### Purchase confirmation

This is shown once the payment is successfully completed, could show components to share the purchase in social media or refer it with friends to get discounts on the purchase.

### My Orders

Will show the purchased orders for the logged user.

### My Order details

Will show the details for the selected Order, it also allows the user to download the Ticket PDF.

# Component styling
### Button
```js
interface IButtonStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
}
```
### Input
```js
interface IInputStyles {
  color?: ColorValue
  container?: StyleProp<ViewStyle>
  input?: StyleProp<TextStyle>
  lineWidth?: number
  activeLineWidth?: number
  baseColor?: ColorValue
  errorColor?: ColorValue
}
```
# Exported components
## Login

Import the component from the library

```js
import { Login } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
<Login
  onLoginSuccessful: (userProfile: IUserProfile, accessToken: string) => void
  onLoginError?: (error: IError) => void

  onFetchUserProfileError?: (error: IError) => void
  onFetchUserProfileSuccess?: (data: any) => void

  onFetchAccessTokenError?: (error: IError) => void
  onFetchAccessTokenSuccess?: () => void
  
  isLoginDialogVisible: boolean
  showLoginDialog: () => void
  hideLoginDialog: () => void

  //Logout
  onLogoutSuccess?: () => void
  onLogoutError?: () => void

  userFirstName={loggedUserName}
  refs={{
    inputs?: {
      email?: any
      password?: any
    }
    button?: {
      containerView?: any
      touchableOpacity?: any
      loadingView?: any
      activityIndicator?: any
      loadingText?: any
  }}
  brandImages={
    containerStyle?: StyleProp<ViewStyle>
    image1?: ImageSourcePropType
    image1Style?: StyleProp<ImageStyle>
    image2?: ImageSourcePropType
    image2Style?: StyleProp<ImageStyle>
  }
  styles?: ILoginViewStyles
  texts?: ILoginViewTexts
/>
```

### Props
| Property | Description |
|----------|-------------|
| onLoginSuccessful: (userProfile: IUserProfile, accessToken: string)` |When login was successful, return userProfile data and the access token to use if for future API requests.
| onLoginFailure?: (error: string) | When login fails will return the error received. |
| onFetchUserProfileFailure?: (error: string) | This is used if the authentication worked but the fetch of the userProfile failed. |
| onFetchAccessTokenFailure?: (error: string) | When the fetch of the access token failed. |
| isLoginDialogVisible: boolean | Flag to show or hide the login dialog. |
| showLoginDialog: () => void | Callback to show the Login dialog. |
| hideLoginDialog: () => void | Callback to hide the Login dialog. |
| onLogoutSuccess?: () => void | Use it to logout the authenticated user. It will delete all the stored data, including access token. Please make sure to update the `userFirstName` prop so the component will show the logged out view. |
|onLogoutFail?: () => void | Will be called if something went wrong while deleting the local data. |
|styles?: ILoginViewStyles | Use this to style your components. |
|texts?: ILoginViewTexts | Use this to change some texts that appear in this component. |
|userFirstName?: string | Once authenticated send the received firstName data to this prop, so the component can render the Logged in view. |
|brandImages?: ILoginBrandImages | Receives up to 2 images with their styles and the container style for the images. |

### styles

```js
interface ILoginViewStyles {
  guest?: {
    loginButton?: IButtonStyles
    linesContainer?: StyleProp<ViewStyle>
    line1?: StyleProp<TextStyle>
    line2?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
  }
  dialog?: {
    container?: StyleProp<ViewStyle>
    loginButton?: IButtonStyles
    loginButtonDisabled?: IButtonStyles
    input?: IInputStyles
    title?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
  }
  loggedIn?: {
    container?: StyleProp<ViewStyle>
    placeholder?: StyleProp<TextStyle>
    value?: StyleProp<TextStyle>
    button?: IButtonStyles
    message?: StyleProp<TextStyle>
  }
}
```

\*Note: Logos images styles are passed from the `brandImages` prop.

### texts
```js
{
  loginButton?: string
  logoutButton?: string
  line1?: string
  line2?: string
  message?: string
  dialog?: {
    loginButton?: string
    message?: string
    title?: string
  }
  logoutDialog?: {
    title?: string
    message?: string
    confirm?: string
    cancel?: string
  }
  loggedIn?: {
    loggedAs?: string
    notYou?: string
  }

```
---

## Tickets

Import the component from the library

```js
import { Tickets } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
<Tickets eventId={EVENT_ID} onAddToCartSuccess={handleOnAddToCartSuccess} />
```

### Props

```js
{
  eventId: number

  // Callbacks for when user taps on GET Tickets button
  onAddToCartSuccess: (data: {
    isBillingRequired: boolean
    isPhoneRequired?: boolean
    isAgeRequired?: boolean
    minimumAge?: number
    isNameRequired?: boolean
  }) => void
  onAddToCartError?: (error: {
    code: number
    message: string
    extraData?: any
  }) => void
  
  // Callbacks for fetching the tickets
  onFetchTicketsError?: (error: {
    code: number
    message: string
    extraData?: any
  }) => void
  
  // Callbacks for fetching the Event base on the eventId prop
  onFetchTicketsSuccess?: (data: {
    tickets: ITicket[]
    promoCodeResponse: {
      success?: boolean
      message?: string
    }
    isInWaitingList: boolean
    isAccessCodeRequired: boolean
  }) => void
  onFetchEventError?: (error: {
    code: number
    message: string
    extraData?: any
  }) => void

  // Callbacks for Waiting list
  onAddToWaitingListSuccess?: (data: any) => void
  onAddToWaitingListError?: (error: {
    code: number
    message: string
    extraData?: any
  }) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean

  onPressMyOrders: () => void
  onPressLogout?: () => void

  // With the following 3 props you can control the visibility of the stock loading indicators and alerts, so you can use your own.
  onLoadingChange?: (isLoading: boolean) => void
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean
  
  promoCodeCloseIcon?: ImageSourcePropType
}
```

`eventId` is required in order to fetch the tickets from this event.
`onAddToCartSuccess` is called after the Add to Cart was completed successfully, it will return the following data:

```js
{
  isBillingRequired: boolean
  isPhoneRequired?: boolean
  isAgeRequired?: boolean
  minimumAge?: number
  isNameRequired?: boolean
}
```

You can then call the `BillingInfo` component and pass them as props in the `cartProps` prop.

`onFetchTicketsSuccess` When tickets fetching was successful, will return fetched data, including `promoCodeResponse`.

### styles
```js
{
  rootContainer?: ViewStyle
  container?: ViewStyle
  title?: TextStyle
  getTicketsButtonDisabled?: IButtonStyles
  getTicketsButtonActive?: IButtonStyles
  promoCode?: {
    rootContainer?: StyleProp<ViewStyle>
    contentWrapper?: StyleProp<ViewStyle>
    content?: StyleProp<ViewStyle>
    input?: TextInputProps['style']
    inputPlaceholderColor?: string

    mainButton?: IButtonStyles
    applyButton?: IButtonStyles
    applyDisabledButton?: IButtonStyles

    errorMessage?: StyleProp<TextStyle>
    validMessage?: StyleProp<TextStyle>

    cancelButton?: StyleProp<ViewStyle>
    cancelIcon?: StyleProp<ImageStyle>
  }
  ticketList?: {
    listContainer?: ViewStyle
    item?: {
      container?: ViewStyle
      ticketName?: TextStyle
      price?: TextStyle
      oldPrice?: TextStyle
      fees?: TextStyle
      soldOutText?: TextStyle
      soldOutContainer?: ViewStyle
      dropdown?: IDropdownStyles
      pricesContainer?: StyleProp<ViewStyle>
    }
  }
  loading?: {
    animation?: {
      color?: ActivityIndicatorProps['color']
      size?: ActivityIndicatorProps['size']
    }
    content?: ViewStyle
    text?: TextStyle
  }
  waitingList?: {
    rootContainer?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    button?: IButtonStyles
    input?: IInputStyles
    buttonDisabled?: IButtonStyles
    success?: {
      container?: StyleProp<ViewStyle>
      title?: StyleProp<ViewStyle>
      message?: StyleProp<ViewStyle>
    }
  }
  loggedIn?: {
    rootContainer?: StyleProp<ViewStyle>
    myOrdersButton?: IButtonStyles
    logOutButton?: IButtonStyles
  }
}
```

### texts
```js
{
  promoCode?: {
    promoCodeButton?: string
    inputPlaceHolder?: string
    apply?: string
    cancel?: string
    mainButton?: string
    title?: string
  }
  getTicketsButton?: string
  title?: string
  waitingList?: {
    title?: string
    firstName?: string
    lastName?: string
    email?: string
    button?: string
    successTitle?: string
    successMessage?: string
  }
  loggedInTexts?: {
    logoutDialog?: {
      title?: string
      message?: string
      confirmButton?: string
      cancelButton?: string
    }
    myOrderButtonText?: string
    logOutButtonText?: string
  }
  listItem?: {
    soldOut?: string
    salesNotStarted?: string
    salesEnded?: string
    inclFees?: string
    exclFees?: string
    free?: string
    ticket?: string
  }
}
```
---
## BillingInfo

Import the component from the library

```js
import { BillingInfo } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<BillingInfo
  cartProps: { 
    isBillingRequired: boolean
    isNameRequired: boolean
    isAgeRequired: boolean
    isPhoneRequired: boolean
    minimumAge: number
  }
  // registerNewUser
  onRegisterSuccess?: (tokens: ITokens) => void
  onRegisterError?: (error: string) => void

  onCheckoutSuccess: (data: {   
    id: string
    hash: string
    total: string
    status: string
  }) => void
  onCheckoutError?: (error: IError) => void

  onLoginSuccess: (data: any) => void
  onLoginError?: (error: IError) => void


  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileError?: (error: IError) => void

  //fetchCart
  onFetchCartError?: (error: IError) => void
  onFetchCartSuccess?: () => void

    // fetchCountries
  onFetchCountriesError?: (error: IError) => void
  onFetchCountriesSuccess?: () => void

  // fetchState
  onFetchStatesError?: (error: IError) => void
  onFetchStatesSuccess?: () => void

  // fetch Token
  onFetchAccessTokenError?: (error: IError) => void
  onFetchAccessTokenSuccess?: () => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  // Configure the skipping component visible, when isBillingRequired is false
  skipBillingConfig?: {
    styles?: {
      rootContainer?: StyleProp<ViewStyle>
      dialogContainer?: StyleProp<ViewStyle>
      brandImage?: StyleProp<ImageStyle>
      text?: StyleProp<TextStyle>
      activityIndicator?: {
        color?: ColorValue
        size?: 'large' | 'small'
      }
    }
    brandImage?: ImageSourcePropType
    isActivityIndicatorVisible?: boolean
  }

  loginBrandImages?:  {
    containerStyle?: StyleProp<ViewStyle>
    image1?: ImageSourcePropType
    image1Style?: StyleProp<ImageStyle>
    image2?: ImageSourcePropType
    image2Style?: StyleProp<ImageStyle>
  }
/>
```

### Props
| Property | Description |
|----------|-------------|
| cartProps | Received from the Tickets component |
| onCheckoutSuccess | Will return Order data from the Checkout action |
| loginBrandImages | Receives styles and images sources to show in the `Login` component |
| skipBillingConfig | Configure the skipping component, visible when `isBillingRequired` is set to false |

### texts
```js
interface IBillingInfoViewTexts {
  loginTexts?: ILoginViewTexts
  checkoutButton?: string
  skippingMessage?: string
  form?: {
    firstName?: string
    lastName?: string
    email?: string
    confirmEmail?: string
    password?: string
    confirmPassword?: string
    phone?: string
    street?: string
    city?: string
    country?: string
    state?: string
    zipCode?: string
    dateOfBirth?: string
    isSubToBrand?: string // your brand's checkbox label
    ticketHoldersTitle?: string
    ticketHolderItem?: string
    holderFirstName?: string
    holderLastName?: string
    holderEmail?: string
    holderPhone?: string
    getYourTicketsTitle?: string
    emailsAdvice?: string
    choosePassword?: string
    optional?: string
  }
}
```

### styles

```js
interface IBillingInfoViewStyles {
  rootContainer?: StyleProp<ViewStyle>
  loginStyles?: ILoginViewStyles
  checkoutButton?: IButtonStyles
  checkoutButtonDisabled?: IButtonStyles
  passwordTitle?: StyleProp<TextStyle>

  inputStyles?: IInputStyles
  dropdownStyles?: IDropdownStyles
  dropdownMaterialStyles?: {
    container?: StyleProp<ViewStyle>
    button?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    label?: StyleProp<TextStyle>
    dialog?: StyleProp<ViewStyle>
    flatListContainer?: StyleProp<ViewStyle>
    listItem?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      buttonSelected?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
      textSelected?: StyleProp<TextStyle>
    }
    input?: IInputStyles
  }
  checkboxStyles?: ICheckboxStyles

  screenTitle?: StyleProp<TextStyle>
  ticketHoldersTitle?: StyleProp<TextStyle>
  ticketHolderItemHeader?: StyleProp<TextStyle>

  texts?: StyleProp<TextStyle>
  customCheckbox?: ICheckboxStyles

  datePicker?: IDatePickerStyles
  
  privacyPolicyLinkStyle?: StyleProp<TextStyle>
}
```

---

## Checkout

Import the component from the library

```js
import { Checkout } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<Checkout
  eventId={EVENT_ID}
  hash={hash}
  total={total}
  onPaymentSuccess={handleOnPaymentSuccess}
  onPressExit={handleStripeError}
  areLoadingIndicatorsEnabled={false}
  styles={styles}
  {...props}
/>
```

### Props

```js
{
  eventId: number
  hash: string
  total: string

  onFetchOrderReviewError?: (error: IError) => void
  onFetchOrderReviewSuccess?: (data: any) => void

  onFetchEventConditionsError?: (error: IError) => void
  onFetchEventConditionsSuccess?: (data: any) => void

  onCheckoutCompletedSuccess?: (data: any) => void
  onCheckoutCompletedError?: (error: IError) => void

  onPaymentSuccess: (data: any) => void
  onPaymentError?: (error: IError) => void

  onStripeInitializeError?: (error: string) => void

  onPressExit: () => void

  texts?: {
    title?: string
    subTitle?: string
    missingStripeConfigMessage?: string
    exitButton?: string
    payButton?: string
    freeRegistrationButton?: string
    providePaymentInfo?: string
    orderReviewItems?: {
      event?: string
      ticketType?: string
      numberOfTickets?: string
      price?: string
      total?: string
    }
  }

  styles?: ICheckoutStyles

  onLoadingChange?: (isLoading: boolean) => void
  onSkippingStatusChange?: (status: | 'skipping'
  | 'fail'
  | 'success'
  | 'false'
  | undefined) => void
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean
}
```
| Property | Description |
|----------|-------------|
| eventId | Same as used in the `Tickets` component. |
| hash | retrieved from the `onCheckoutSuccess` callback in the `BillingInfo`component. |
| total | retrieved from the `onCheckoutSuccess` callback in the `BillingInfo` component. |
| onPaymentSuccess | will handle the success in the payment process. Will return the `hash`. |
| areLoadingIndicatorsEnabled | whether or not show the Loading Indicator, `default: true`. |
| areAlertsEnabled | whether or not show the Error Alerts, `default: true`. |

*Note: If the you need to modify the card container, use the `styles.payment.cardContainer` prop. Useful if the card is to short and the zip code is not visible.*

### styles

```js
{
  rootStyle?: ViewStyle
  title?: StyleProp<TextStyle>
  subTitle?: StyleProp<TextStyle>
  missingStripeConfig?: {
    container?: StyleProp<ViewStyle>
    message?: StyleProp<TextStyle>
    exitButton?: IButtonStyles
  }
  freeRegistrationButton?: IButtonStyles
  orderReview?: IOrderReviewStyles
  payment?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    cardBackgroundColor?: string
    cardContainer?: StyleProp<ViewStyle>
    button?: IButtonStyles
    buttonDisabled?: IButtonStyles
  }
}
```

### Stripe

Currently, Stripe card is not customizable. Please see the open issues in their Github.

- [563](https://github.com/stripe/stripe-react-native/issues/563)
- [285](https://github.com/stripe/stripe-react-native/issues/285)

Additionally, if you are encountering problems with building your project, please take a look at the [Stripe troubleshooting](https://github.com/stripe/stripe-react-native#troubleshooting).

---
## Purchase Confirmation

Import the component from the library

```js
import { PurchaseConfirmation } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<PurchaseConfirmation
  orderHash={checkoutProps!.hash}
  onComplete={handleOnComplete}

  styles?: {
    rootContainer?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>

    message?: {
      container?: StyleProp<ViewStyle>
      line1?: StyleProp<TextStyle>
      line2?: StyleProp<TextStyle>
    }
    exitButton?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
    }
  }

  texts?: {
    title?: string
    message?: {
      line1?: string
      line2?: string
    }
    exitButton?: string
  }
/>
```
### Props
| Property | Description |
|----------|-------------|
| orderHash | The `hash` returned in the `BillingInfo` component |
| onComplete | To handle the completion of the flow. Here you can handle the unmount of the component or navigate to another screen |
| styles | Styles for the component |
| texts | Texts for the component  |


---
## My Orders
If there is a valid session, there will appear a button to access `MyOrders` in the `Tickets` component.

Import the component from the library.

```js
import { MyOrders } from 'tf-checkout-react-native'
```


### Props

```js
{
  onSelectOrder: (order: {
    order: {
    header: {
      isReferralDisabled: boolean
      shareLink: string
      total: string
      salesReferred: string
    },
    items: [
      {
        name: string
        currency: string
        price: string
        discount: string
        quantity: string
        total: string
      },
      {...}
    ],
    tickets: [
      {
        hash: string
        ticketType: string
        holderName?: string
        holderEmail?: string
        holderPhone?: string
        status: string
        pdfLink?: string
        qrData?: string
        isSellable?: boolean
        description?: string
        descriptionPlain?: string
      },
      {...}
    ]
  }
  }) => void

  onFetchMyOrdersSuccess?: () => void
  onFetchMyOrdersError?: (error: IError) => void

  onFetchOrderDetailsSuccess?: () => void
  onFetchOrderDetailsError?: (error: IError) => void

  onLoadingChange?: (isLoading: boolean) => void

  styles?: IMyOrdersStyles
  config?: {
    isEventsDropdownHidden?: boolean
    areActivityIndicatorsEnabled?: boolean
    areAlertsEnabled?: boolean
  }
  texts?: {
    selectEventPlaceholder?: string
    title?: string
  }
}
```

### styles
```js
{
  orderListItem?: {
    rootContainer?: StyleProp<ViewStyle>
    contentContainer?: StyleProp<ViewStyle>
    infoContainer?: StyleProp<ViewStyle>
    infoTopContainer?: StyleProp<ViewStyle>
    infoBottomContainer?: StyleProp<ViewStyle>
    imageContainer?: StyleProp<ViewStyle>
    image?: StyleProp<ImageStyle>
    infoRootContainer?: StyleProp<ViewStyle>
    iconNextContainer?: StyleProp<ViewStyle>
    iconNext?: StyleProp<ImageStyle>
    orderId?: StyleProp<TextStyle>
    orderDate?: StyleProp<TextStyle>
    eventName?: StyleProp<TextStyle>
    priceContainer?: StyleProp<ViewStyle>
    price?: StyleProp<TextStyle>
    currency?: StyleProp<TextStyle>
  }
  safeArea?: StyleProp<ViewStyle>
  listContainer?: StyleProp<ViewStyle>
  eventsContainer?: StyleProp<ViewStyle>
  eventsTitle?: StyleProp<TextStyle>
  refreshControlColor?: ColorValue
  eventsDropdown?: {
    container?: StyleProp<ViewStyle>
    button?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    label?: StyleProp<TextStyle>
    dialog?: StyleProp<ViewStyle>
    flatListContainer?: StyleProp<ViewStyle>
    listItem?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      buttonSelected?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
      textSelected?: StyleProp<TextStyle>
    }

  }
  rootContainer?: StyleProp<ViewStyle>
  eventsSelectionContainer?: StyleProp<ViewStyle>
  clearEventSelectionIcon?: StyleProp<ImageStyle>
}
```

---

## MyOrder Details

When user selects an order from the `MyOrders` component, will show it details.

Import the component from the library.

```js
import { MyOrderDetails } from 'tf-checkout-react-native'
```

### Props

```js
{
  data: IMyOrderDetailsResponse
  config?: {
    areActivityIndicatorsEnabled?: boolean
    areAlertsEnabled?: boolean
  }
  onDownloadStatusChange?: (status?: 
    'downloading' | 
    'downloaded' | 
    'failed'
  ) => void
  downloadStatusIcons?: {
    success?: ImageSourcePropType
    error?: ImageSourcePropType
  }
  onAndroidWritePermission?: (permission?: boolean) => void
  onLinkCopied?: (copied?: boolean) => void
  styles?: {
    rootContainer?: StyleProp<ViewStyle>
    header?: {
      container?: StyleProp<ViewStyle>
      title?: StyleProp<TextStyle>
      subTitle?: StyleProp<TextStyle>

      shareLink?: {
        container?: StyleProp<ViewStyle>
        text?: StyleProp<TextStyle>
        link?: StyleProp<TextStyle>
        copyContainer?: StyleProp<ViewStyle>
        copyText?: StyleProp<TextStyle>
        copyIcon?: StyleProp<ImageStyle>
        copyIconTint?: ColorValue
        copyIconTintActive?: ColorValue
        message?: StyleProp<TextStyle>
        referrals?: StyleProp<TextStyle>
        referralValue?: StyleProp<TextStyle>
      }
    }
    section0Footer?: {
      container?: StyleProp<ViewStyle>
      label?: StyleProp<TextStyle>
      value?: StyleProp<TextStyle>
    }
    sectionHeader?: StyleProp<TextStyle>

    listItem?: {
      container?: StyleProp<ViewStyle>
      innerLeftContainer?: StyleProp<ViewStyle>
      innerRightContainer?: StyleProp<ViewStyle>
      rowPlaceholder?: StyleProp<TextStyle>
      rowValue?: StyleProp<TextStyle>
    }
    ticketItem?: {
      container?: StyleProp<ViewStyle>
      innerLeftContainer?: StyleProp<ViewStyle>
      innerRightContainer?: StyleProp<ViewStyle>
      rowPlaceholder?: StyleProp<TextStyle>
      rowValue?: StyleProp<TextStyle>
    }
    downloadButton?: IButtonStyles
  }
  texts?: {
    title?: string
    subTitle?: string
    referralLink?: string
    referral?: {
      soFar?: string
      tickets?: string
    }
    listItem?: {
      title?: string
      ticketType?: string
      price?: string
      quantity?: string
      total?: string
    }
    ticketItem?: {
      title?: string
      ticketId?: string
      ticketType?: string
      ticketHolder?: string
      status?: string
      download?: string
    }
    downloadNotification?: {
      successMessage?: string
      errorMessage?: string
    }
    copyText?: {
      copy?: string
      copied?: string
    }
  }
}
```

