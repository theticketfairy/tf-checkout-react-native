# tf-checkout-react-native

React Native library for Ticket Fairy checkout

# Requirements

Configure [ReactNative environment](https://reactnative.dev/docs/environment-setup) for desired platforms (iOS, Android or both).

### Android

- Android 5.0 (API level 21) and above
- Android gradle plugin 4.x and above

### iOS

- Compatible with apps targeting iOS 11 or above.

# Installation

```
yarn add tf-checkout-react-native
```

or

```
npm install tf-checkout-react-native
```

# Run the example app

1. Clone this repo.
2. In the App.tsx file, update the `EVENT_ID` const with the assigned ID to be able to retrieve data from the server.
3. cd into the project folder and `yarn` or `npm install`.
4. cd into the example folder and `yarn` or `npm install`.
   - If running on iOS, cd into ios folder and `pod install && cd ..`.
5. Run `yarn ios` or `npm run ios` to initialize and run in the iPhone simulator.
6. If running on Android, run `yarn android` or `npm run android` to run it in the Android emulator or connected physical device.

## Android

Add below dependency to your `app/build.gradle` file with specified version (in our example we are using `1.4.0`).

```
implementation 'com.google.android.material:material:<version>'
```

Set appropriate style in your styles.xml file.

```
<style name="Theme.MyApp" parent="Theme.MaterialComponents.DayNight.NoActionBar">
    <!-- ... -->
</style>
```

# Features [🚧 WIP 🚧]

This library exports 4 main components:

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

# Usage [🚧 WIP 🚧]

## Tickets

Import the component from the library

```js
import { Tickets } from 'tf-checkout-react-native'
```

Then add it to the render function.

```js
<Tickets eventId={EVENT_ID} onAddToCartSuccess={handleOnAddToCartSuccess} />
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

## BillingInfo

Import the component from the library

```js
import { BillingInfo } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<BillingInfo
  cartProps={cartProps!}
  onCheckoutSuccess={handleOnCheckoutSuccess}
/>
```

`cartProps` will receive

```js
{
  isBillingRequired: boolean
  isNameRequired: boolean
  isAgeRequired: boolean
}
```

`onCheckoutSuccess` will be called when the user completes all the data required in the form. Will return the following data:

```js
{
  id: string
  hash: string
  total: string
  status: string
}
```

`hash` and `total` will be used in the `Checkout` component.

## Checkout

Import the component from the library

```js
import { Checkout } from 'tf-checkout-react-native'
```

Add it to the render function.

```js
<Checkout
  eventId={EVENT_ID}
  hash={checkoutProps!.hash}
  total={checkoutProps!.total}
  onPaymentSuccess={handleOnPaymentSuccess}
/>
```

`eventId` Same as used in the `Tickets` component.

`hash` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo`component.

`total` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo` component.

`onPaymentSuccess` will handle the success in the payment process. Will return the `hash`.

## PurchaseConfirmation

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

## MyOrders

## MyOrderDetails

To be able to open the downloaded file in iOS, you will need to add 2 flags in the info.plist file of your xCode folder.

- UIFileSharingEnabled: Application supports iTunes file sharing
- LSSupportsOpeningDocumentsInPlace: Supports opening documents in place
