# tf-checkout-react-native

React Native library for Ticket Fairy checkout.

For Single Sign-On (SSO) Please be awere that this is the first version of the implementation, we are working to release a V2, that will cover other use cases, in the near future.

# Requirements

Configure [ReactNative environment](https://reactnative.dev/docs/environment-setup) for desired platforms (iOS, Android or both).

### React Native

- Suggested ReactNative version `0.66.3`
- Suggested Flipper version `0.99.0`
- React version `0.17.1`
- Node version `16.10.0`
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

### Metro
Add the following to your `metro.config.js` in the resolver property:

`sourceExts: ['jsx', 'js', 'ts', 'tsx']`

Result: 
````js
module.exports = {
  watchFolders: [moduleRoot],
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx'],
    extraNodeModules: {
      react: path.resolve(__dirname,
    }
    .... 
````


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

```ts
import { setConfig } from 'tf-checkout-react-native'
```

Use it in your initial useEffect function, please keep in mind this is an `async` function. It is highly recommended that you track when `setConfig` is finished, and pass that control prop to the Tickets component.

```ts

const YourComponent: FC () => {
    const [isCheckingCurrentSession, setIsCheckingCurrentSession] = useState(true)

  useEffect(() => {
    const initConfig = async () => {
      setIsCheckingCurrentSession(true)

      await setConfig({
        EVENT_ID: '4344',
        CLIENT: 'ttf',
        ENV: 'STAG',
        CLIENT_ID: '3emd9023349dfn',
        CLIENT_SECRET: 'CCEw33o4030e4df',
        AUTH: {
          ACCESS_TOKEN: 'token393939',
          REFRESH_TOKEN: 'dee2030edmd',
          TOKEN_TYPE: 'bearer',
          SCOPE: 'scope',
        }
      })

      setIsCheckingCurrentSession(false)
    }

    initConfig()
  }, [])

  return <Tickets 
    isCheckingCurrentSession 
  />
}
```

`setConfig` set your event's configuration, with the following options:

````ts
{
  EVENT_ID?: string | number,
  CLIENT?: string,
  ENV?: 'PROD' | 'DEV' | 'STAG',
  CLIENT_ID?: string,
  CLIENT_SECRET?: string,
  TIMEOUT?: number,
  BRAND?: string,
  ARE_SUB_BRANDS_INCLUDED?: boolean
  AUTH?: {
    ACCESS_TOKEN: string
    REFRESH_TOKEN: string
    TOKEN_TYPE: string
    SCOPE: string
  }
}
````
### Props
| Property | Description |
| -------- | ----------- |
| EVENT_ID | Specify the event's ID. |
| CLIENT | Specify your client designated name example `ttf`. |
| ENV | Sets the environment to any of the following environments: Production, Staging or Development. Receives the following values: `PROD`, `DEV`, `STAG`. Defaults to `PROD`.|
| CLIENT_ID | Set your CLIENT_ID. |
| CLIENT_SECRET | Set your CLIENT_SECRET. |
| BRAND | Set your BRAND so users can only see this brand in their orders. |
| TIMEOUT | Set custom timeout for the APIs requests. |
| ARE_SUB_BRANDS_INCLUDED | If true will include orders from the `BRAND` sub-brands. Default `false`. |
| AUTH | Object that receives data for Single Sign On (SSO).|

# Run the example app

1. Clone this repo.
2. In the App.tsx file, update the `EVENT_ID` const with the assigned ID to be able to retrieve data from the server.
3. cd into the _root project_ folder and `yarn` or `npm install`.
4. cd into the _example_ folder and `yarn` or `npm install`.
   - If running on iOS, cd into ios folder and `pod install && cd ..`.
5. Run `yarn ios` or `npm run ios` to initialize and run in the iPhone simulator.
6. If running on Android, run `yarn android` or `npm run android` to run it in the Android emulator or connected physical device.

# Features

This library exports the following components:

### Login

Used to authenticate the user and request password restore.

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

### Tickets Resale

Let the user to resale their tickets. They can choose between selling them to a friend or to any other user.

### Reset Password

After opening and URL with the corresponding schema, use this component to let the user reset its password.

### Exported functions

- setConfig: Sets config for the library

- refreshAccessToken: Let refresh the expired access token.

# Component styling
### Button
```ts
interface IButtonStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
}
```
### Input
```ts
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

### Checkbox

```ts
interface ICheckboxStyles {
  container?: StyleProp<ViewStyle>
  content?: StyleProp<ViewStyle>
  indicator?: StyleProp<ViewStyle>
  indicatorDisabled?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
  box?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
}
```

# Exported functions
## setConfig
Set the configuration for the library.

```ts
export interface IConfig {
  EVENT_ID: string | number
  CLIENT?: string
  ENV?: EnvType
  CLIENT_ID?: string
  CLIENT_SECRET?: string
  TIMEOUT?: number
  BRAND?: string
  ARE_SUB_BRANDS_INCLUDED?: boolean
  // AUTH is used for single sign on v1.
  // It receives the needed information for the authenticated user.
  AUTH?: {
    ACCESS_TOKEN: string
    REFRESH_TOKEN: string
    TOKEN_TYPE: string
    SCOPE: string
  }
}
```
## refreshAccessToken

Let refresh the expired access token, it can use the internal stored refresh token, passing nothing to it, or you can pass a `string` refresh token.

```ts
const response: IFetchAccessTokenResponse = await refreshAccessToken(refreshToken?: string)
```

Returns the new access token data or error.

```ts
accessTokenError?: {
  code?: number
  message: string
}
accessTokenData?: {
  accessToken: string
  refreshToken: string
  tokenType: string
  scope: string
}
```

# Exported handlers
## SessionCoreHandle
Exports function to refresh access token.

### refreshAccessToken
Allows to refresh access token inside the component. It will automatically re-fetch the component's data from the server. You will need to create a `ref` object with the corresponding type.

Example: 

In your parent component
```ts 
const sessionHandleRef = useRef<SessionHandleType>(null)

// Call the refreshAccessToken function by using
await sessionHandleRef.current?.refreshAccessToken()
```

# Exported components
Depending on your needs, you can use the UI Components or the Core Components.

[UI Components](#ui-components) use the Core Components at their core but also exposes an UI that you can configure with your own styles. There is no need to create any kind of logic with them, only setConfig and implement the callbacks to get their data.

[Core Components](#core-components) are wrappers that don't include any UI neither validation logics, they only act as a Middleware to retrieve and send data from the server and return it to your implementation components. They are useful when your design cannot be achieved by the UI components. You will need to use references to access their exposed functions.

# UI Components

[Login](#login-ui)

[Tickets](#tickets-ui)

[BillingInfo](#billinginfo-ui)

[Checkout](#checkout-ui)

[Purchase Confirmation](#purchase-confirmation-ui)

[My Orders](#my-orders-ui)

[My Order Details](#myorder-details-ui)

[Resale](#resale-tickets-ui)

[Reset Password](#reset-password-ui)

---
## Session handle

In all components with the exception of Login and Reset Password, you can pass a `ref` with type `SessionHandleType` to access two functions:

`refreshAccessToken` After a successful access token refresh, it will re-fetch component's data from server when applicable.
`reloadData` It will re-fetch component's data from server.

---
## Login UI

Import the component from the library

```tsx
import { Login } from 'tf-checkout-react-native'
```

Then add it to the render function.

```tsx
<Login
  onLoginSuccessful: (
    userProfile: IUserProfile, 
    accessTokenData?: IFetchAccessTokenData
  ) => void
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

  isShowPasswordButtonVisible?: boolean

  //Restore password
  onRestorePasswordError?: (error: IError) => void
  onRestorePasswordSuccess?: () => void
/>
```

### Data Types
#### IUserProfile
```ts
{
  customerId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAddress: string
  zipCode: string
  countryId: string
  company?: string
  state: string
  stateId: string
  city: string
}
```

#### IFetchAccessTokenData
```ts
{
  accessToken: string
  refreshToken: string
  tokenType: string
  scope: string
}
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
| onRestorePasswordError?: (error: string) | When restore password fails will return the error received. |
| onRestorePasswordSuccess? | Called when restore password request was successful |

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
  restorePassword?: {
    rootContainer?: StyleProp<ViewStyle>
    restorePasswordButton?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
    }
    cancelRestorePasswordButton?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
    }
    input?: IInputStyles
    title?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
    apiError?: StyleProp<TextStyle>
  }
  restorePasswordSuccess?: {
    rootContainer?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
    button?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
    }
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
  restorePassword?: {
    restorePasswordButton?: string
    cancelButton?: string
    message?: string
    inputLabel?: string
    title?: string
  }
  restorePasswordSuccess?: {
    title?: string
    message?: string
    button?: string
  }
}
```
---
## Tickets UI 

This component will first fetch for the Event's data, if data is ok, then will fetch the tickets for this event. 

### Password protected event

If the Event's response returns a `401` error, then it means it's password protected and need to authenticate with a password. Then the `EnterPassword` component will be shown for the user to enter the password.

Import the component from the library.

```js
import { Tickets } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
const sessionHandleRef = useRef<SessionHandleType>(null)

<Tickets 
  ref={sessionHandleRef}
  onAddToCartSuccess={handleOnAddToCartSuccess} />
```

### Props

```js
{
  ref?: SessionHandleType
  // Callbacks for when user taps on GET Tickets button
  onAddToCartSuccess: (data: {
    isBillingRequired: boolean
    isPhoneRequired?: boolean
    isAgeRequired?: boolean
    minimumAge?: number
    isNameRequired?: boolean
    isTicketFree?: boolean
    isPhoneHidden?: boolean
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

  onLoadingChange?: (isLoading: boolean) => void 
  promoCodeCloseIcon?: ImageSourcePropType

  // Event password protected
  onPressSubmitEventPassword?: (password: string) => void
  passwordProtectedEventData?: {
    isPasswordProtected?: boolean
    message?: string
    apiError?: string
    isLoading?: boolean
  }

  // Configure the Component behavior
  config: {
    areActivityIndicatorsEnabled?: boolean
    areAlertsEnabled?: boolean
    areTicketsSortedBySoldOut?: boolean
    areTicketsGrouped?: boolean
  }

  // For SSO
  isCheckingCurrentSession?: boolean
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

### config prop
Configure the component's behavior 
```ts
config: {
  // Whether or not show the loading indicators.
  areActivityIndicatorsEnabled?: boolean
  // Whether or not show the alerts.
  areAlertsEnabled?: boolean
  // Whether or not the Ticket should be sorted by Sold Out.
  areTicketsSortedBySoldOut?: boolean
  // Whether or not the tickets should be grouped, they need to be configured as groups in the Tickets admin.
  areTicketsGrouped?: boolean
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
    rootContainer?: ViewStyle
    contentWrapper?: ViewStyle
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
    sectionHeader?: {
      container?: StyleProp<ViewStyle>
      title?: StyleProp<TextStyle>
    }
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
  enterPassword?: {
    input?: IInputStyles
    title?: StyleProp<TextStyle>
    error?: StyleProp<TextStyle>
    button?: IButtonStyles
    rootContainer?: StyleProp<ViewStyle>
    contentContainer?: StyleProp<ViewStyle>
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
  enterPassword?: {
    inputLabel?: string
    title?: string
    buttonText?: string
  }
}
```
---
## BillingInfo UI

Import the component from the library

```js
import { BillingInfo } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
const sessionHandleRef = useRef<SessionHandleType>(null)


<BillingInfo
  ref={sessionHandleRef}
  cartProps: { 
    isBillingRequired: boolean
    isNameRequired: boolean
    isAgeRequired: boolean
    isPhoneRequired: boolean
    minimumAge: number
  }
  // registerNewUser
  onRegisterSuccess?: (data: {
      accessTokenData: {
        accessToken: string
        refreshToken: string
        tokenType: string
        scope: string
      }
      userProfile: {
        firstName: string
        lastName: string
        email: string
      }
    }) => void
  onRegisterError?: (error: { 
    isAlreadyRegistered?: boolean
    message?: string
    raw?: any
  }) => void

  onCheckoutSuccess: (data: {   
    id: string
    hash: string
    total: string
    status: string
  }) => void
  onCheckoutError?: (error: IError) => void

  // See ILoginSuccessData data type below.
  onLoginSuccess: (data: ILoginSuccessData) => void
  onLoginError?: (error: IError) => void

  onFetchUserProfileSuccess?: (data: any) => void
  onFetchUserProfileError?: (error: IError) => void

  //fetchCart
  onFetchCartError?: (error: IError) => void
  onFetchCartSuccess?: () => void

    // fetchCountries
  onFetchCountriesError?: (error: IError) => void
  onFetchCountriesSuccess?: (data: {
    code: string
    id: string
    name: string
  }[]) => void

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

### DataTypes
ILoginSuccessData

```ts
interface ILoginSuccessData {
  userProfile: {
    customerId: string
    firstName: string
    lastName: string
    email: string
    phone: string
    streetAddress: string
    zipCode: string
    countryId: string
    company?: string
    state: string
    stateId: string
    city: string
  }
  accessTokenData?: {
    accessToken: string
    refreshToken: string
    tokenType: string
    scope: string
  }
}
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
  invalidPhoneNumberError?: string
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
    phoneInput?: {
      label?: string
      customError?: string
    }
    ttfPrivacyPolicyRequiredError?: string
  }
  cartTimer?: {
    message?: string
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
  
  checkboxStyles?: {
    container?: StyleProp<ViewStyle>
    content?: StyleProp<ViewStyle>
    indicator?: StyleProp<ViewStyle>
    indicatorDisabled?: StyleProp<ViewStyle>
    text?: StyleProp<TextStyle>
    box?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    error?: StyleProp<TextStyle>
  }

  screenTitle?: StyleProp<TextStyle>
  ticketHoldersTitle?: StyleProp<TextStyle>
  ticketHolderItemHeader?: StyleProp<TextStyle>

  texts?: StyleProp<TextStyle>
  customCheckbox?: ICheckboxStyles

  datePicker?: IDatePickerStyles
  
  privacyPolicyLinkStyle?: StyleProp<TextStyle>

  phoneInput?: {
    rootContainer?: StyleProp<ViewStyle>
    errorColor?: ColorValue
    country?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
    }
    input?: IInputStyles
  }

  cartTimer?:  {
    rootContainer?: StyleProp<ViewStyle>
    contentContainer?: StyleProp<ViewStyle>
    textsContainer?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    message?: StyleProp<TextStyle>
    time?: StyleProp<TextStyle>
  }

  privacyPolicyLinkStyle?: StyleProp<TextStyle>
}
```
---

## Checkout UI

Import the component from the library

```js
import { Checkout } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
const sessionHandleRef = useRef<SessionHandleType>(null)

<Checkout
  ref={sessionHandleRef}
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
  ref?: SessionHandleType
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
    cartTimer?: {
      message?: string
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
| hash | retrieved from the `onCheckoutSuccess` callback in the `BillingInfo`component. |
| total | retrieved from the `onCheckoutSuccess` callback in the `BillingInfo` component. |
| onPaymentSuccess | will handle the success in the payment process. Will return the `hash`. |
| areLoadingIndicatorsEnabled | whether or not show the Loading Indicator, `default: true`. |
| areAlertsEnabled | whether or not show the Error Alerts, `default: true`. |

*Note: If the you need to modify the card container, use the `styles.payment.cardContainer` prop. Useful if the card is to short and the zip code is not visible.*

### styles

```ts
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
  cartTimer?: {
    rootContainer?: StyleProp<ViewStyle>
    contentContainer?: StyleProp<ViewStyle>
    textsContainer?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    message?: StyleProp<TextStyle>
    time?: StyleProp<TextStyle>
  }
}
```

### Stripe

Currently, Stripe card is not customizable. Please see the open issues in their Github.

- [563](https://github.com/stripe/stripe-react-native/issues/563)
- [285](https://github.com/stripe/stripe-react-native/issues/285)

Additionally, if you are encountering problems with building your project, please take a look at the [Stripe troubleshooting](https://github.com/stripe/stripe-react-native#troubleshooting).

---
## Purchase Confirmation UI

Import the component from the library

```js
import { PurchaseConfirmation, SessionHandleType } from 'tf-checkout-react-native'
```

Add it to the render function.

```ts
const sessionHandleRef = useRef<SessionHandleType>(null)

<PurchaseConfirmation
  ref={sessionHandleRef}
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
## My Orders UI
If there is a valid session, there will appear a button to access `MyOrders` in the `Tickets` component.

Import the component from the library.

```js
import { MyOrders, SessionHandleType } from 'tf-checkout-react-native'
```


### Props

```ts
{
  ref={SessionHandleType}
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

  onFetchMyOrdersSuccess?: (data: IMyOrdersData) => void
  onFetchMyOrdersError?: (error: IError) => void

  onFetchOrderDetailsSuccess?: (data: IMyOrderDetailsData) => void
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
IMyOrdersData
```ts
{
  events: {
    event_name: string
    url_name: string
  }[]
  orders: {
    amount: string
    currency: string
    date: string
    eventEndDate: string
    eventId: string
    eventName: string
    eventSalesEndDate: string
    eventSalesStartDate: string | null
    eventStartDate: string
    eventUrl: string
    hideVenue: boolean
    hideVenueUntil: string | null
    id: string
    image: string
    timezone: string
    venueCity: string
    venueCountry: string
    venueGooglePlaceId?: string
    venueLatitude?: string
    venueLongitude?: string
    venueName?: string
    venuePostalCode?: string
    venueState: string
    venueStreet?: string
    venueStreetNumber?: string
  }[]
  //Those mark with ? are only included if the venue is not hidden
  filter?: string
  brandFilter?: string
  subBrands?: boolean
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}
```
IMyOrderDetailsData
```ts
{
  header: {
    currency: string
    date: string
    eventEndDate: string
    eventId: string
    eventName: string
    eventSalesEndDate: string
    eventSalesStartDate: string
    eventStartDate: string
    eventUrl: string
    hideVenueUntil: string | null
    id: string
    image: string
    isReferralDisabled: boolean
    isVenueHidden: boolean
    salesReferred: string
    shareLink: string
    timeZone: string
    total: string
    venue: {
      city: string
      country: string
      googlePlaceId?: string
      latitude?: string
      longitude?: string
      name?: string
      postalCode?: string
      state: string
      street?: string
      streetNumber?: string
    }
    //Those mark with ? are only included if the venue is not hidden
  }
  items?: {
    currency: string
    discount: string
    hash: string
    isActive: boolean
    name: string
    price: string
    quantity: string
    total: string
  }[]
  tickets: {
    currency: string
    description: string
    descriptionPlain?: string
    eventName: string
    hash: string
    holderEmail?: string
    holderName: string
    holderPhone?: string
    isOnSale: boolean
    isSellable: boolean
    isTable: boolean
    pdfLink: string
    qrData: string
    resaleFeeAmount: number
    status: string
    ticketType: string
    ticketTypeHash: string
  }[]
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

## MyOrder Details UI

When user selects an order from the `MyOrders` component, will show it details.

Import the component from the library.

```js
import { MyOrderDetails, SessionHandleType } from 'tf-checkout-react-native'
```

### Props

```tsx
{
  ref={SessionHandleType}
  data: IMyOrderDetailsData

  // Used to navigate to the Resale Tickets screen
  onPressResaleTicket: (
    ticket: IMyOrderDetailsTicket,
    isTicketTypeActive: boolean
  ) => void

  onRemoveTicketFromResaleSuccess: (message: string) => void

  onRemoveTicketFromResaleError?: (error: IError) => void


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

  moreButtonIcon?: StyleProp<ImageStyle>

  ticketActionsIcons?: {
    downloadPdf?: ImageSourcePropType
    sell?: ImageSourcePropType
    removeFromSale?: ImageSourcePropType
    refund?: ImageSourcePropType
  }

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
      rootContainer?: StyleProp<ViewStyle>
      leftContent?: StyleProp<ViewStyle>
      rightContent?: StyleProp<ViewStyle>
      rowPlaceholder?: StyleProp<TextStyle>
      rowValue?: StyleProp<TextStyle>
      downloadButton?: IButtonStyles
      moreButton?: StyleProp<ViewStyle>
      moreButtonIcon?: StyleProp<ImageStyle>
    }
    downloadButton?: {
      container?: StyleProp<ViewStyle>
      button?: StyleProp<ViewStyle>
      text?: StyleProp<TextStyle>
    }
    bottomSheetModal?: {
      rootContainer?: StyleProp<ViewStyle>
      headerContainer?: StyleProp<ViewStyle>
      content?: StyleProp<ViewStyle>
      title?: StyleProp<TextStyle>
      closeButton?: StyleProp<ViewStyle>
      closeButtonIcon?: StyleProp<ImageStyle>
      contentContainer?: StyleProp<ViewStyle>
    }
  ticketActions?: {
    rootScrollViewContainer?: StyleProp<ViewStyle>
    buttonContainer?: StyleProp<ViewStyle>
    buttonContent?: StyleProp<ViewStyle>
    icon?: StyleProp<ImageStyle>
    text?: StyleProp<TextStyle>
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
      ticketType: string
      holderName: string
      ticketId: string
      status: string
      download: string
      sellTicket: string
      removeTicketFromResale: string
    }
    downloadNotification?: {
      successMessage?: string
      errorMessage?: string
    }
    copyText?: {
      copy?: string
      copied?: string
    }
    sellTicket?: string
    removeTicketFromResale?: string
    ticketsTitle?: string

    bottomSheetModal?:  {
      title?: string
    }
    ticketActions?: {
      downloadPdf?: string
      sell?: string
      removeFromSale?: string
      refund?: string
    }
  }
}
```

## Resale Tickets UI

Allows the user to resale the tickets they bought. They can decide wether sell it to a friend or to any other user.


Import the component from the library.

```js
import { ResaleTickets, SessionHandleType } from 'tf-checkout-react-native'
```

### Props

```ts
{
  ref={SessionHandleType}
  ticket: {
    currency: string
    description: string
    descriptionPlain?: string
    eventName: string
    hash: string
    holderEmail?: string
    holderName: string
    holderPhone?: string
    isOnSale: boolean
    isSellable: boolean
    pdfLink: string
    qrData: string
    resaleFeeAmount: number
    status: string
    ticketType: string
  }
  styles?: {
    rootContainer?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    terms?: IResaleTermsStyles
    resaleTicketsButton?: IButtonStyles
    resaleTicketsButtonDisabled?: IButtonStyles
    resaleTicketsButtonLoading?: IButtonStyles
    ticketOrderDetails?: ITicketOrderDetailsStyles
    ticketBuyerForm?: ITicketBuyerFormStyles
    termsCheckbox?: ICheckboxStyles
  }
  onResaleTicketsSuccess: (
    resaleTicketData: {
      message: string
    },
    ticket: {
      currency: string
      description: string
      descriptionPlain?: string
      eventName: string
      hash: string
      holderEmail?: string
      holderName: string
      holderPhone?: string
      isOnSale: boolean
      isSellable: boolean
      pdfLink: string
      qrData: string
      resaleFeeAmount: number
      status: string
      ticketType: string
    }
  ) => void
  onResaleTicketsError?: (error: {
    code?: number
    message: string
    extraData?: any
  }) => void
  config?: {
    areAlertsEnabled?: boolean
    areActivityIndicatorsEnabled?: boolean
  }
  texts?: {
    title?: string
    orderDetails?: {
      title?: string
      eventName?: string
      orderedBy?: string
      orderId?: string
    }
    sellToWhom?: {
      title?: string
      friend?: string
      anyone?: string
    }
    friendForm?: {
      firstName?: string
      lastName?: string
      email?: string
      emailConfirm?: string
    }
    terms?: {
      title?: string
      paragraph1?: string
      paragraph2_1?: string
      paragraph2_2?: string
      paragraph3_1?: string
      paragraph3_2?: string
    }
    agree?: string
    resaleTicketsButton?: string
  }
}
```

## Reset Password UI

After opening and URL with the corresponding schema and token, use this component to let the user reset its password.

### Usage
Import the component from the library.
```ts
import { ResetPassword } from 'tf-checkout-react-native'
```

Then add it to the render function.

```xml
<ResetPassword
  styles={myStyles}
  token={resetToken}
  onPressResetButton={handleOnPressResetButton}
  onPressCancelButton={handleOnPressCancelButton}
  onResetPasswordSuccess={handleOnResetPasswordSuccess}
  onResetPasswordError={handleOnResetPasswordError}
/>
```

### Props

```ts
{
  token: string
  styles?: {
    rootContainer?: StyleProp<ViewStyle>
    contentContainer?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    resetButton?: IButtonStyles
    cancelButton?: IButtonStyles
    input?: IInputStyles
    apiError?: StyleProp<TextStyle>
    apiSuccess?: StyleProp<TextStyle>
  }
  texts?: {
    title?: string
    resetButton?: string
    cancelButton?: string
    newPasswordLabel?: string
    confirmNewPasswordLabel?: string
  }
  onResetPasswordSuccess?: (data: { 
    message: string
    status?: number
    }) => void
  onResetPasswordError?: (error: {
    code?: number
    message: string
    extraData?: any
  }) => void
  onPressResetButton?: () => void
  onPressCancelButton?: () => void
}
```


# Core Components
**⚠️ Remember that you first need to set your configuration using the [setConfig](#set-your-configuration)
 function. ⚠️**

 ### Index

[TicketsCore](#ticketscore)

[WaitingListCore](#waitinglistcore)

[BillingCore](#billingcore)

[CheckoutCore](#checkoutcore)

[PurchaseConfirmationCore](#purchaseconfirmationcore)

[MyOrdersCore](#myorderscore)

[OrderDetailsCore](#orderdetailscore)

[LoginCore](#logincore)

[ResetPasswordCore](#resetpasswordcore)
 
---
## SessionCoreHandle

All Core components with the exception of Login and ResetPassword exposes the `refreshAccessToken` function to re-authenticate the user after the access token is expired. This is through the corresponding `CoreHandle` ref.

It returns the `IFetchAccessTokenResponse` object: 

```ts
IFetchAccessTokenResponse {
  accessTokenError?: {
    code?: number
    message: string
    extraData?: any
  }
  accessTokenData?: {
    accessToken: string
    refreshToken: string
    tokenType: string
    scope: string
  }
}
```


### Example:

Import the component from the library

```js
import { 
  TicketsCore 
  TicketsCoreHandle // You can import the Handle to use it as type in the useRef hook
} from 'tf-checkout-react-native'
```

Declare a reference to pass it to the component.

```js
const ticketsCoreRef = useRef<TicketsCoreHandle>(null)
```

Then add it to the render function and assign the reference to the corresponding component.

```js
<TicketsCore ref={ticketsCoreRef}>
  <YourComponent />
</TicketsCore>
```

Use the reference to access the component methods.

```js
const handleGetTickets = async () => {
  const res = await ticketsCoreRef.current.refreshAccessToken()
}
```

---

## TicketsCore
This is the initial component to show. It will retrieve the tickets, event, present My Orders and Logout buttons if the user is logged in, and will add the selected tickets to the cart.

Exposes the following functions: 

`getTickets` Fetches the tickets from the event set in the config function. It receives a promoCode parameter to apply to the tickets.

`getEvent` Fetches the event from the eventId set in the config function.

`addToCart` Adds the selected tickets to the cart.

`postReferralVisit` Posts a referral visit to the server.

`refreshAccessToken` : Refreshes expired access token.

```js
{
  // Fetches the tickets from the event set in the config function. It receives a promoCode parameter to apply to the tickets.
  getTickets(promoCode?: string): Promise<{
    tickets?: {
      sortOrder: number
      displayTicket?: boolean
      salesEnded: boolean
      salesStarted: boolean
      id: string
      displayName: string
      optionName: string
      optionValue: string
      isTable: string
      feeIncluded: boolean
      price: number
      basePrice: number
      chosen: number
      priceCurrency: string
      priceSymbol: string
      taxesIncluded: boolean
      taxName: string
      minQuantity: number
      maxQuantity: number
      multiplier: number
      tags: []
      allowMultiplePurchases: number
      priceReplacementText: string
      waitingListEnabled: boolean
      soldOut?: boolean
      soldOutMessage: string
      minGuests?: number
      maxGuests?: number
      buyButtonText?: string
      totalStock: number
      guestPrice?: number
      alwaysAvailable: string
      feeText: string
      x_face_value: number
      sold_out?: boolean
      oldPrice?: number
      oldBasePrice?: number
      descriptionRich?: string
    }[]
    error?: {
      code?: number
      message: string
      extraData?: any
    }
    promoCodeResult?: {
      isValid: boolean | number
      message: string
    }
    isInWaitingList?: boolean
    isAccessCodeRequired?: boolean
  }>

  // Fetches the event from the eventId set in the config function.
  getEvent(): Promise<{
    eventError?: {
      code?: number
      message: string
      extraData?: any
    }
    eventData?: {
      affirmAllowed: boolean
      alwaysShowWaitingList?: any
      backgroundImage: string
      backgroundVideo?: string
      brandCheckoutPixels?: string
      brandConversionPixels?: string
      brandGoogleAnalyticsKey?: string
      brandPagePixels?: string
      checkoutPixels?: string
      conversionPixels?: string
      country: string
      currency: {
        currency: string
        decimal_places: number
        symbol: string
      }
      date: string
      description?: string
      descriptions: any
      enableWaitingList: boolean
      endDate: string
      eventType: any
      facebookEvent?: string
      faq: []
      feeMode: string
      feesIncluded?: any
      formattedDate: string
      fullTitleReplacement?: any
      hideTopInfluencers: boolean
      hideVenue?: boolean
      hideVenueUntil?: string
      imageUrl: string
      imageUrlHd: string
      imageURLs: any
      isTimeSlotEvent: boolean
      l10nLanguages: []
      minimumAge?: any
      name: string
      ogImage?: string
      pagePixels?: string
      passwordAuthenticated: boolean
      passwordProtected: boolean
      preregEnabled: boolean
      preregistered: []
      presalesEnded: boolean
      presalesStarted: boolean
      productImage: string
      redirectUrl?: string
      referrals: []
      referralsEnabled: boolean
      relatedProducts: []
      salesEnd: string
      salesEnded: boolean
      salesStart?: string
      salesStarted: boolean
      slug: string
      startDate: string
      subHeading?: any
      tableMapEnabled: boolean
      tags: []
      ticketsSold: number
      timezone: string
      title: string
      titleReplacementHeight?: any
      titleReplacementImage?: any
      titleReplacementImageSvg?: any
      twitterImage?: string
      venueCity?: string
      venueCountry: string
      venueGooglePlaceId?: string
      venueLatitude?: string
      venueLongitude?: string
      venueName?: string
      venuePostalCode?: string
      venueState?: string
      venueStreet?: string
      venueStreetNumber?: string
      waitingListMaxQuantity: number
    }
  }>

  // Adds selected tickets to the cart.
  addToCart(
    options: {  
      optionName: string
      ticketId: string
      quantity: number
      price: number
    }
  ): Promise<{
    error?: {
      code?: number
      message: string
      extraData?: any
    }
    data?: {
      isBillingRequired: boolean
      isPhoneRequired?: boolean
      isAgeRequired?: boolean
      minimumAge?: number
      isNameRequired?: boolean
      isTicketFree?: boolean
      isPhoneHidden?: boolean
    }

    postReferralVisit(referralId: string): Promise<
      postReferralError?: {
        code?: number
        message: string
        extraData?: any
      }
      postReferralData?: {
      message: string
      status: number
    }>
    refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
  }>
}
```

Import the component from the library

```js
import { 
  TicketsCore 
  TicketsCoreHandle // You can import the Handle to use it as type in the useRef hook
} from 'tf-checkout-react-native'
```

Declare a reference to pass it to the component.

```js
const ticketsCoreRef = useRef<TicketsCoreHandle>(null)
```

Then add it to the render function and assign the reference to the corresponding component.

```js
<TicketsCore ref={ticketsCoreRef}>
  <YourComponent />
</TicketsCore>
```

Use the reference to access the component methods.

```js
const handleGetTickets = async () => {
  const res = await ticketsCoreRef.current.getTickets()
}
```
---

## WaitingListCore
This component *must* appear after getting the response from **getTickets()** and the property `isInWaitingList` is set to true.


Exposes the following functions: 
```tsx
{
  addToWaitingList(
    params: {
      firstName: string
      lastName: string
      email: string
    }
  ): Promise<{
    addToWaitingListError?: {
      code?: number
      message: string
      extraData?: any
    }
    addToWaitingListData?: {
      error: boolean
      message: string
      status: number
      success: boolean
    }
  }>
  refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
}
```
**addToWaitingList** Receives params with the following properties:
```js
firstName: string
lastName: string 
email: string
```

And returns a Promise with the following object: 

```js
{
  addToWaitingListError?: {
    code?: number // If it was a server error, this will be the error code
    message: string //Error message that you could use it in your UI
    extraData?: any // If there is a relevant extra data, it will be returned here
  }
  addToWaitingListData?: {
    error: boolean // If there was an error, this will be true
    message: string // message that you could use it in your UI, could be due an error or a success message
    status: number // Status code
    success: boolean // If there was no error, this will be true
  }
}
```

Import the component from the library

```js
import { 
  WaitingListCore 
  WaitingListCoreHandle // You can import the Handle to use as type it in the useRef hook
} from 'tf-checkout-react-native'
```

Declare a reference to pass it to the component.

```js
const waitingListCoreRef = useRef<WaitingListCoreHandle>(null)
```

Then add it to the render function and assign the reference to the corresponding component.

```js
<WaitingListCore ref={waitingListCoreRef}>
  <YourComponent />
</WaitingListCore>
```

Use the reference to access the component methods.

```js
const handleAddToWaitingList = async (params: IAddToWaitingListCoreParams) => {
  const res = await waitingListCoreRef.current.addToWaitingList(params)
}
```
---

## BillingCore
This component collects user's billing information and checks the order out. If the entered user data is already in the system it will perform checkout, other wise it will perform a registration and then the checkout.

Exposes the following functions: 

`getCart` Fetches the current cart information, needed to know how many ticket holders data is needed.

`getCountries` Fetches the countries list.

`getStates` Fetches the states list.

`getUserProfile` Fetches the user profile information.

`registerNewUser` Registers a new user. Returns accessTokens data.

`checkoutOrder` Performs the checkout.


```ts
{
  // Fetches the current cart information, needed to know how many ticket holders data is needed.
  getCart(): Promise<{
    cartError?: {
      code?: number
      message: string
      extraData?: any
    }
    cartData?: {
      quantity: number
      isTfOptInHidden?: boolean
      isTfOptIn: boolean // Ticket fairy
      isMarketingOptedIn: boolean // Brand
    }
  }>

  // Performs the checkout.
  checkoutOrder(body: ICheckoutBody): Promise<{
    error?: {
      code?: number
      message: string
      extraData?: any
    }
    data?: {
      id: string
      hash: string
      total: string
      status: string
    }
  }>

  // Fetches the country list.
  getCountries(): Promise<{
     countriesError?: {
       code?: number
       message: string
       extraData?: any
     }
    countriesData?:  {
      code: string
      id: string
      name: string
    }[]
  }>

  // Fetches the states list.
  getStates(countryId: string): Promise<{
    statesError?: {
       code?: number
       message: string
       extraData?: any
     }
    statesData?: {
      [key: number | string]: string
    }
  }>

  // Fetches the user profile information.
  getUserProfile(): Promise<{
    userProfileError?: {
       code?: number
       message: string
       extraData?: any
     }
    userProfileData?: {
      customerId: string
      firstName: string
      lastName: string
      email: string
      phone: string
      streetAddress: string
      zipCode: string
      countryId: string
      company?: string
      state: string
      stateId: string
      city: string
    }
  }>

  // Registers a new user.
  registerNewUser(data: FormData): Promise<{
    registerNewUserResponseError?: {
      isAlreadyRegistered?: boolean
      message?: string
      raw?: any
    }
    registerNewUserResponseData?: {
      accessTokenData: {
        accessToken: string
        refreshToken: string
        tokenType: string
        scope: string
      }
      userProfile: {
        firstName: string
        lastName: string
        email: string
      }
    }
  }>

  refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
}

```
---

## CheckoutCore
Shows the event conditions, purchase details and process the payment and free registration to an event.

You will need to install and use the [ReactNative Stripe SDK](https://github.com/stripe/stripe-react-native) (we recommend version 0.2.3). Follow their documentation to implement it. Our backend is already prepared to process the payments. 

Remember that you will need the `publishableKey`. 

After you collect the card information and call the `confirmPayment` function, you will need to call the `paymentSuccess` function to complete the payment.


Exposes the following functions:

`getEventConditions` Get event conditions for the current event.

`getPurchaseOrderDetails` Get purchase order details for the current event.

`getOrderReview`  Get order review for the current event.

`freeRegistration` Free registration to an event.

`paymentSuccess` Payment success.

`refreshAccessToken` Refreshes access token.


```ts
// Get event conditions for the Event Id set on the setConfig.
getEventConditions(): Promise<any>

// Get purchase order details for the current event.
getPurchaseOrderDetails(orderId: string): Promise<{
  orderDetailsError?: {
    code?: number
    message: string
    extraData?: any
  }
  orderDetailsData?: {
    header: {
      isReferralDisabled: boolean
      shareLink: string
      total: string
      salesReferred: string
    }
    items: {
      isActive: boolean
      currency: string
      discount: string
      name: string
      price: string
      quantity: string
      total: string
    }[]
    tickets: {
      currency: string
      description: string
      descriptionPlain?: string
      eventName: string
      hash: string
      holderEmail?: string
      holderName: string
      holderPhone?: string
      isOnSale: boolean
      isSellable: true
      pdfLink: string
      qrData: string
      resaleFeeAmount: number
      status: string
      ticketType: string
    }[]
  }
}>

// Get order review for the current event.
getOrderReview(orderHash: string): Promise<{
  orderReviewError?: {
    code?: number
    message: string
    extraData?: any
  }
  orderReviewData?: {
    reviewData: {
      event: string
      price: string
      ticketType: string
      total: string
      numberOfTickets: string
      currency: string
    }
    paymentData: {
      id: string
      name: string
      stripeClientSecret?: string
      stripeConnectedAccount?: string
      stripePublishableKey?: string
    }
    addressData: {
      city: string
      line1: string
      state: string
      postalCode: string
    }
    billingData: {
      firstName: string
      lastName: string
    }
  }
}>

// Free registration to an event.
freeRegistration(orderHash: string): Promise<{
  freeRegistrationError?: {
    code?: number
    message: string
    extraData?: any
  }
  freeRegistrationData?: {
    id: string
    customerId: string
    total: string
    currency: string
    orderHash: string
  }
}>

// Payment success.
paymentSuccess(orderHash: string): Promise<any>

// Refresh access token.
refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
```
---
## PurchaseConfirmationCore
Shows the purchase confirmation information.

It exposes the following functions:

`getPurchaseConfirmation` Get purchase confirmation for the current event.

`refreshAccesstoken` Refreshes access token.

```ts
getPurchaseConfirmation(
    orderHash: string
  ): Promise<{
    purchaseConfirmationError?: {
      code?: number
      message: string
      extraData?: any
    }
    purchaseConfirmationData?: {
      conversionPixels?: any
      currency: { 
        currency: string; 
        decimalPlaces: number; 
        symbol: string 
      }
      customConfirmationPageText?: string
      customerId: string
      isReferralDisabled: boolean
      eventDate: string
      eventDescription: string
      eventType: string
      message: string
      orderTotal: number
      personalShareLink: string
      productId: string
      productImage: string
      productName: string
      productPrice: number
      productUrl: string
      twitterHashtag?: string
      personalShareSales: {
        price: number
        sales: number
      }[]
    }
  }>
  refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>
```
---
## MyOrdersCore
Shows the purchased orders from the user. It can also show the sub-brands if the `ARE_SUB_BRANDS_INCLUDED` was set to true and the `BRAND` was set to an existing brand. 

Exposes the following functions:

`getMyOrders` Get the orders purchased from the current user.

`getOrderDetails` Get the details from a specific order.

`refreshAccessToken` Refreshes access token.


```ts
refreshAccessToken(refreshToken?: string): Promise<IFetchAccessTokenResponse>

getMyOrders(page: number, filter: string): Promise<{
  myOrdersData?: {
    events: {
      url_name: string
      event_name: string
    }[]

    orders: {
      id: string
      date: string
      currency: string
      amount: string
      eventName: string
      eventUrl: string
      image: string
    }[]
    filter?: string
    brandFilter?: string
    subBrands?: boolean
    pagination: {
      page: number
      limit: number
      totalCount: number
      totalPages: number
    }
  }

  myOrdersError?: {
    code?: number
    message: string
    extraData?: any
  }
}>


getOrderDetails(orderId: string): Promise<{
  orderDetailsError?: {
    code?: number
    message: string
    extraData?: any
  }
  orderDetailsData?: {
    header: {
      isReferralDisabled: boolean
      shareLink: string
      total: string
      salesReferred: string
    }
    items: {
      isActive: boolean
      currency: string
      discount: string
      name: string
      price: string
      quantity: string
      total: string
    }[]
    tickets: {
      currency: string
      description: string
      descriptionPlain?: string
      eventName: string
      hash: string
      holderEmail?: string
      holderName: string
      holderPhone?: string
      isOnSale: boolean
      isSellable: true
      pdfLink: string
      qrData: string
      resaleFeeAmount: number
      status: string
      ticketType: string
    }[]
  }
}>
```
---
## OrderDetailsCore
Allows to re-sale the tickets or to remove them from the re-sale system.

Import it from the library.
```ts
import { OrderDetailsCore, OrderDetailsCoreHandle } from 'tf-checkout-react-native';
```

Create a ref

```ts
const myOrderDetailsCoreRef = useRef<OrderDetailsCoreHandle>(null)
```

Assign the ref to the wrapper component.

```tsx
 <OrderDetailsCore ref={myOrderDetailsCoreRef}>
```

Access the exposed function through the current value.
```ts
await myOrderDetailsCoreRef.current.removeTicketFromResale(ticket.hash)
```


```ts
resaleTicket(
/*  
    formData.append('to', toWhom)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('email', email)
    formData.append('confirm_email', emailConfirm)
    formData.append('confirm', String(isTermsAgreed)) 
*/

    data: FormData,
    orderHash: string
  ): Promise<{
    {
      resaleTicketError?: {
        code?: number
        message: string
        extraData?: any
      }
      resaleTicketData?: {
        message: string
      }
    }
  }>
```

```ts
  removeTicketFromResale(
    orderHash: string
  ): Promise<{
      removeTicketFromResaleError?: {
        code?: number
        message: string
        extraData?: any
      }
      removeTicketFromResaleData?: {
        message: string
      }
  }>
```
---
## LoginCore
Handles the login and logout process.

Exposes the following functions:

`login` Logs in the user.

`logout` Logs out the user.

```ts
login(fields?: {
  email: string
  password: string
}): Promise<{
  error?: {
    code?: number
    message: string
    extraData?: any
  }

  userProfile?: {
    customerId: string
    firstName: string
    lastName: string
    email: string
    phone: string
    streetAddress: string
    zipCode: string
    countryId: string
    company?: string
    state: string
    stateId: string
    city: string
  }

  accessTokenData?: {
    accessToken: string
    refreshToken: string
    tokenType: string
    scope: string
  }
}>

logout(): Promise<void>
```
---
## ResetPasswordCore
Will allow the user to reset its password.

Exposes the following function: 

`postResetPassword` Sends the reset token and the new password values.

postResetPassword parameters: 
```
  token: string,
  password: string,
  password_confirmation: string,
```
postResetPassword returning data:

```ts
{
  data?: {
    message: string
    status?: number
  }
  error?: {  
    code?: number
    message: string
    extraData?: any
  }
}
```

### Usage
Import it from the library.

```ts
import { ResetPasswordCore, ResetPasswordCoreHandle } from 'tf-checkout-react-native'
```
Wrap your component with the Core component.

```xml
<ResetPasswordCore ref={resetPasswordCoreRef}>
  {yourComponent}
</ResetPasswordCore>
```

# Utils

`deleteAllData` asynchronously deletes all the data stored in the local storage. Use this with caution, only in an edge case. 

# Changelog

## Version 1.0.28
- Add more data to the `getMyOrders` success response.
- Add more data to the `getOrderDetails` success response.
- Add `ticketsSold` prop to Event's object in fetchEvent success data.

## Version 1.0.27
- Make `EVENT_ID` optional in the `setConfig` function. An error will be returned when `EVENT_ID` is not set and trying to make a request that requires it.

- Remove `eventId` prop from `Checkout UI` component in favor of use the one on the Config.

- Add missing pagination data in `onFetchMyOrdersSuccess` response.

- Add missing success data in `onFetchOrderDetailsSuccess` response.

## Version 1.0.26
- Add the possibility to remove all of the following Billing/Street Address fields from free tickets:
  - Billing Street Address
  - City
  - State/County
  - Post Code/Zip
  - Country

- Update `addToCart` success response to include: 
```  
isTicketFree?: boolean
isPhoneHidden?: boolean
  ```

## Version 1.0.25
- Exposes `refreshAccessToken` function.
- Changed returned `data` prop to `userProfile` in LoginCore response.
- In **LoginCore Component**:
  - Add `accessTokenData` object prop in `onLoginSuccessful` response.
- On **BillingUI Component**:
  - Change `onRegisterSuccess` return data type.
  - Change `onRegisterError` return data type.
- On **LoginCore**:
  - Change `login` return data type to include `accessTokenData` object.
- Exports `SessionHandleType` to use it in the `ref` of the UI components.
- All UI and Core components except Login and ResetPassword:
  - Export function `refreshAccessToken`
- Add `reloadData` to re-fetch servers data in UI components.

## Version 1.0.24
- Add **SingleSignOn** feature.
- Add show Tickets in groups and the option to sort them by sold out.
- Add config prop to Tickets component:

```ts
    config: {
      // Indicates if loading component should be visible.
      areActivityIndicatorsEnabled?: boolean
      areAlertsEnabled?: boolean
      areTicketsSortedBySoldOut?: boolean
      areTicketsGrouped?: boolean
    }
```
- Updated Tickets styles prop to include Ticket Section Header.
- Moved `areActivityIndicatorsEnabled` and `areAlertsEnabled` to the `config` prop.
- Made TTF Privacy Policy mandatory.
- Added `styles` and `texts` props for TTF Privacy Policy checkbox.
- Added **Password Protected** event feature.

## Version 1.0.23
- Fix Checkout not allowing free registrations

## Version 1.0.22
- Added cartTimer component, that will show the cart's remaining expiration time in the Billing screen.
- setConfig not longer receives the `DOMAIN` prop, instead it receives the `CLIENT` 
- Added a three dot button to my orders to show the possible actions.




