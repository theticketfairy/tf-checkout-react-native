# tf-checkout-react-native

React Native library for Ticket Fairy checkout

# Requirements

Configure [ReactNative environment](https://reactnative.dev/docs/environment-setup) for desired platforms (iOS, Android or both).

### Android

- Android 5.0 (API level 21) and above
- Android gradle plugin 4.x and above

To download the PDFs, add the `WRITE_EXTERNAL_STORAGE` permission to the Android's Manifest file.

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### iOS

- Compatible with apps targeting iOS 11 or above.

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

## Required for Android

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

## Tickets

![image](https://user-images.githubusercontent.com/66479719/151049068-450a52d9-dfc8-40bf-b12a-f2555a832c8d.png)

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

---

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
  hash={checkoutProps!.hash}
  total={checkoutProps!.total}
  onPaymentSuccess={handleOnPaymentSuccess}
/>
```

`eventId` Same as used in the `Tickets` component.

`hash` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo`component.

`total` retrieved from the `onCheckoutSuccess` callback in the `BillingInfo` component.

`onPaymentSuccess` will handle the success in the payment process. Will return the `hash`.

---

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

`onFetchOrderDetailsFail` if the fetching fails, you can use this to know what happened.

---

## MyOrderDetails

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
