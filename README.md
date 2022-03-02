# tf-checkout-react-native

React Native library for Ticket Fairy checkout.

# Requirements

Configure [ReactNative environment](https://reactnative.dev/docs/environment-setup) for desired platforms (iOS, Android or both).

## Android

- Android 5.0 (API level 21) and above
- Minimum Gradle plugin version `4.2.2`
- Minimum Gradle version `6.7.1`
- Compile Sdk Version and Target Sdk Version `31`
- Build Tools Version `30.0.3`

Add the following to your Android Manifest as activity property.

```
android:exported="true"
```

To download the PDFs, add the `WRITE_EXTERNAL_STORAGE` permission to the Android's Manifest file.

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

## iOS

- Compatible with apps targeting iOS 11 or above.

- Pods version `1.11.2`
- Command Line Tools version `13.0`

To download the PDFs, add the following flags to `Info.plist` file:

- UIFileSharingEnabled: Application supports iTunes file sharing
- LSSupportsOpeningDocumentsInPlace: Supports opening documents in place

# Installation

```node
yarn add tf-checkout-react-native
```

or

```node
npm install tf-checkout-react-native
```

Make sure to install all the required dependencies in your project.

# Required for Android

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
    IS_BILLING_STREET_NAME_REQUIRED: false,
  })
}, [])
```

`setConfig` set your event's configuration, with the following options:

```js
{
  DOMAIN?: string,
  BASE_URL?: string,
  CLIENT_ID?: string,
  CLIENT_SECRET?: string,
  TIMEOUT?: number,
  BRAND?: string,
  ARE_SUB_BRANDS_INCLUDED?: boolean
}
```

`DOMAIN` Specify your domains name example: `https://google.com` this is important to maintain cart session active and prevent it from expiring when user login in the BillingInfo component.

`BASE_URL` If our dev team gives you a custom BASE_URL.

`CLIENT_ID` Set your CLIENT_ID.

`CLIENT_SECRET` Set your CLIENT_SECRET.

`BRAND`: Set your BRAND so users can only see this brand in their orders.

`TIMEOUT` Set custom timeout for the APIs requests.

`ARE_SUB_BRANDS_INCLUDED` If true will include orders from the `BRAND` sub-brands.

# Run the example app

1. Clone this repo.
2. In the App.tsx file, update the `EVENT_ID` const with the assigned ID to be able to retrieve data from the server.
3. cd into the project folder and `yarn` or `npm install`.
4. cd into the example folder and `yarn` or `npm install`.
   - If running on iOS, cd into ios folder and `pod install && cd ..`.
5. Run `yarn ios` or `npm run ios` to initialize and run in the iPhone simulator.
6. If running on Android, run `yarn android` or `npm run android` to run it in the Android emulator or connected physical device.

# Features [🚧 WIP 🚧]

This library exports the following components:

## Login

Used to authenticate the user.

## Tickets

Will retrieve and show a list of tickets corresponding to `eventId`. It also includes a PromoCode component that validates it and updates the tickets list.

User can select what ticket type wants to buy and the quantity of tickets.

## Billing information

User will need to enter its data into a form to create a Ticket Fairy account. Also, depending on the number of tickets selected, will need to fill the information of each one of them.

## Checkout

Will show the order details and a card form that the user will need to fill with its card details.

TicketFairy doesn't store any card related data, we use [Stripe](https://stripe.com/) as payments solution.

## Purchase confirmation

This is shown once the payment is successfully completed, could show components to share the purchase in social media or refer it with friends to get discounts on the purchase.

## My Orders

Will show the purchased orders for the logged user.

## My Order details

Will show the details for the selected Order, it also allows the user to download the Ticket PDF.

# Usage [🚧 WIP 🚧]

# Login

Import the component from the library

```js
import { Login } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
<Login
  onLoginSuccessful={handleOnLoginDialogSuccess}
  isLoginDialogVisible={isLoginDialogVisible}
  showLoginDialog={() => setIsLoginDialogVisible(true)}
  hideLoginDialog={() => setIsLoginDialogVisible(false)}
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
/>
```

## Props

`onLoginSuccessful: (userProfile: IUserProfile, accessToken: string)`
When login was successful, return userProfile data and the access token to use if for future API requests.

`onLoginFailure?: (error: string)`
When login fails will return the error received.

`onFetchUserProfileFailure?: (error: string)`
This is used if the authentication worked but the fetch of the userProfile failed.

`onFetchAccessTokenFailure?: (error: string)`
When the fetch of the access token failed.

`isLoginDialogVisible: boolean`
Flag to show or hide the login dialog.

`showLoginDialog: () => void`
Callback to show the Login dialog.

`hideLoginDialog: () => void`
Callback to hide the login dialog.

`onLogoutSuccess?: () => void`  
Use it to logout the authenticated user. It will delete all the stored data, including access token. Please make sure to update the `userFirstName` prop so the component will show the logged out view.

`onLogoutFail?: () => void`
Will be called if something went wrong while deleting the local data.

`styles?: ILoginViewStyles`
Use this to style your components.

`texts?: ILoginViewTexts`
Use this to change some texts that appear in this component.

`userFirstName?: string`
Once authenticated send the received firstName data to this prop, so the component can render the Logged in view.

## styles

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
    logo?: StyleProp<ImageStyle>
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

<img width="899" alt="image" src="https://user-images.githubusercontent.com/66479719/154158723-864cdabd-2a0b-4a84-95ad-3176c67f7e8b.png">

---

# Tickets

![image](https://user-images.githubusercontent.com/66479719/151049068-450a52d9-dfc8-40bf-b12a-f2555a832c8d.png)

Import the component from the library

```js
import { Tickets } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
<Tickets eventId={EVENT_ID} onAddToCartSuccess={handleOnAddToCartSuccess} />
```

## Props
```js
{
  eventId: number

  onAddToCartSuccess: (data: IAddToCartSuccess) => void
  onAddToCartError?: (error: any) => void
  onFetchTicketsError?: (error: any) => void
  onFetchTicketsSuccess?: (data: {
    tickets: ITicket[]
    promoCodeResponse: {
      success?: boolean
      message?: string
    }
    isInWaitingList: boolean
    isAccessCodeRequired: boolean
  }) => void
  onFetchEventError?: (error: string) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean

  onPressMyOrders: () => void
  onPressLogout?: () => void
}
```

`eventId` is required in order to fetch the tickets from this event.
`onAddToCartSuccess` is called after the Add to Cart was completed successfully, it will return the following data:

```js
{
  isBillingRequired: boolean
  isNameRequired: boolean
  isAgeRequired: boolean
}
```

You can then call the `BillingInfo` component and pass them as props in the `cartProps` prop.

`onFetchTicketsSuccess` When tickets fetching was successful, will return fetched data, including `promoCodeResponse`.


## styles

Receives several props to style its sub-components.

```js
{
  rootContainer?: ViewStyle
  container?: ViewStyle
  title?: TextStyle
  getTicketsButtonDisabled?: IButtonStyles
  getTicketsButtonActive?: IButtonStyles
  promoCode?: IPromoCodeStyles
  ticketList?: ITicketListStyles
  loading?: ILoadingStyles
  waitingList?: IWaitingListStyles
  loggedIn?: ILoggedInStyles
}
```

<img width="790" alt="props" src="https://user-images.githubusercontent.com/66479719/153976200-4bd6b254-6e80-49d6-bacc-076c59873434.png">

<img width="675" alt="Screen Shot 2022-02-14 at 19 37 40" src="https://user-images.githubusercontent.com/66479719/153976314-9b4431bd-ea2f-49db-87ab-fb7d68b02a0c.png">

<img width="682" alt="image" src="https://user-images.githubusercontent.com/66479719/154126406-101af4ca-7586-4686-9a93-88ef0375968e.png">

---

# BillingInfo

Import the component from the library

```js
import { BillingInfo } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<BillingInfo
  cartProps: IAddToCartSuccess
  onRegisterSuccess?: (tokens: ITokens) => void
  onRegisterFail?: (error: string) => void

  onCheckoutSuccess: (data: IOnCheckoutSuccess) => void
  onCheckoutFail?: (error: string) => void

  onLoginSuccess: (data: any) => void
  onLoginFail?: (error: string) => void

  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileFail?: (error: any) => void

  onFetchCartError?: (error: string) => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  privacyPolicyLinkStyle?: StyleProp<TextStyle>

  onFetchUserProfileFailure?: (error: string) => void
  onFetchAccessTokenFailure?: (error: string) => void

  styles?: IBillingInfoViewStyles
  texts?: IBillingInfoViewTexts

  logoImage?: ImageSourcePropType
/>
```

## Props

### cartProps

will receive

```js
{
  isBillingRequired: boolean
  isNameRequired: boolean
  isAgeRequired: boolean
}
```

### onCheckoutSuccess

Will be called when the user completes all the data required in the form and taps on the button. Will return the following data:

```js
{
  id: string
  hash: string
  total: string
  status: string
}
```

`hash` and `total` will be used in the `Checkout` component.

### skipBilling

Will auto-populate the checkout form with the logged user data, perform the order `Checkout` and call the callback `onCheckoutSuccess` so you can call the next component.

### canSkipHolderNames

Will skip the need of holder names information and will be automatically filled with the logged user data.

### texts

```js
interface IBillingInfoViewTexts {
  loginTexts?: ILoginViewTexts
  loginButton?: string
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
    isSubToBrand?: string
    ticketHoldersTitle?: string
    ticketHolderItem?: string
    holderFirstName?: string
    holderLastName?: string
    holderEmail?: string
    holderPhone?: string
    getYourTicketsTitle?: string
    emailsAdvice?: string
    choosePassword?: string
    checkbox?: string  // your brand's checkbox label
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
  checkboxStyles?: ICheckboxStyles

  screenTitle?: StyleProp<TextStyle>
  ticketHoldersTitle?: StyleProp<TextStyle>
  ticketHolderItemHeader?: StyleProp<TextStyle>

  texts?: StyleProp<TextStyle>
  customCheckbox?: ICheckboxStyles

  datePicker?: IDatePickerStyles
  skippingDialog?: {
    rootContainer?: StyleProp<ViewStyle>
    dialogContainer?: StyleProp<ViewStyle>
    brandImage?: StyleProp<ImageStyle>
    message?: StyleProp<TextStyle>
    spinner?: {
      color: ColorValue
      size: 'large' | 'small'
    }
  }
}
```

---

# Checkout

Import the component from the library

```js
import { Checkout } from 'tf-checkout-react-native'
```

Add it to the render function.

## Props
```js
{
  eventId: number
  hash: string
  total: string

  onFetchOrderReviewFail?: (error: string) => void
  onFetchOrderReviewSuccess?: (data: any) => void

  onFetchEventConditionsFail?: (error: string) => void
  onFetchEventConditionsSuccess?: (data: any) => void

  onCheckoutCompletedSuccess?: (data: any) => void
  onCheckoutCompletedFail?: (error: string) => void

  onPaymentSuccess: (data: any) => void
  onPaymentError?: (error: string) => void

  onStripeInitializeError?: (error: string) => void

  onPressExit: () => void

  texts?: {
    title?: string
    subTitle?: string
    missingStripeConfigMessage?: string
    exitButton?: string
    payButton?: string
    freeRegistrationButton?: string
  }

  styles?: ICheckoutStyles

  onLoadingChange?: (isLoading: boolean) => void
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean
}
```

`eventId` Same as used in the `Tickets` component.

`hash` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo`component.

`total` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo` component.

`onPaymentSuccess` will handle the success in the payment process. Will return the `hash`.

`areLoadingIndicatorsEnabled` whether or not show the Loading Indicator, `default: true`.

`areAlertsEnabled` whether or not show the Error Alerts, `default: true`.

If the you need to modify the card container, use the `styles.payment.cardContainer` prop. Useful if the card is to short and the zip code is not visible.

`styles`

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


---

# PurchaseConfirmation

Import the component from the library

```js
import { PurchaseConfirmation } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<PurchaseConfirmation
  orderHash={checkoutProps!.hash}
  onComplete={handleOnComplete}
/>
```

`orderHash` the `hash` returned in the `BillingInfo` component.

`onComplete` to handle the completion of the flow. Here you can handle the unmount of the component or navigate to another screen.

---

## MyOrders

![image](https://user-images.githubusercontent.com/66479719/151049211-5faebe6b-df3b-4785-ac0d-3adb7a3d6699.png)

If there is a valid session, there will appear a button to access `MyOrders` in the `Tickets` component.

Import the component from the library.

```js
import { MyOrders } from 'tf-checkout-react-native'
```

There is no need to pass any data prop to it.

### Props

`config` has properties to hide components.

`isEventsDropdownHidden` if the Events dropdown should be hidden.

```js
config={{
  isEventsDropdownHidden: true,
}}
```

`onSelectOrder` handler to know which order the user has selected. Will return an object with following structure:

```js
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
      holderName: string
      status: string
      pdfLink: string
    },
    {...}
  ]
}
```

`styles` to customize the component look & feel.

```js
export interface IMyOrdersStyles {
  orderListItem?: IOrderListItemStyles
  safeArea?: StyleProp<ViewStyle>
  listContainer?: StyleProp<ViewStyle>
  eventsContainer?: StyleProp<ViewStyle>
  eventsTitle?: StyleProp<TextStyle>
  refreshControlColor?: ColorValue
  eventsDropdown?: IDropdownStyles
  rootContainer?: StyleProp<ViewStyle>
  eventsSelectionContainer?: StyleProp<ViewStyle>
  clearEventSelectionIcon?: StyleProp<ImageStyle>
}
```

`onFetchOrderDetailsFail` if the fetching fails, you can use this to know what happened.

---

# MyOrderDetails

![image](https://user-images.githubusercontent.com/66479719/151049265-ebaabb75-58b1-4b22-bf99-83b1375b1a70.png)

When user selects an order from the `MyOrders`component, will show it details.

Import the component from the library.

```js
import { MyOrderDetails } from 'tf-checkout-react-native'
```

### Props

`data` receives same data as the one of the object received from the `onSelectOrder` handler in `MyOrders`component:

```js
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
      holderName: string
      status: string
      pdfLink: string
    },
    {...}
  ]
}
```

`styles` optional, to customize the component look & feel.

```
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
```

`texts` optional, to customize the texts that shows on the labels.

```js
texts?: {
  title?: string
  subTitle?: string
  referralLink?: string
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
}
```
