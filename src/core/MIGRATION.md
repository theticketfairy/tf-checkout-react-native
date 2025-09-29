# Migration from Core Components to Hooks

This document provides a guide for migrating from the deprecated `BillingCore` and `CheckoutCore` components to the new hooks-based implementation.

## Overview

The legacy Core components (`BillingCore` and `CheckoutCore`) are being deprecated in favor of modern React hooks that provide better composability, TypeScript support, and integration with React Query for improved data fetching and caching.

All hooks are exported directly from the package root, so you can import them like this:

```tsx
import { useCart, useCheckout, useCheckoutFlow } from 'tf-checkout-react-native'
```

## Core Components to Hooks Mapping

### BillingCore Functions

| BillingCore Function               | Replacement Hook                             | Import Statement                                             |
| ---------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `getCart()`                        | `useCart()`                                  | `import { useCart } from 'tf-checkout-react-native'`         |
| `getCountries()`                   | `useCountries()`                             | `import { useCountries } from 'tf-checkout-react-native'`    |
| `getStates(countryId)`             | `useStates(countryId)`                       | `import { useStates } from 'tf-checkout-react-native'`       |
| `getUserProfile()`                 | `useUserProfile()`                           | `import { useUserProfile } from 'tf-checkout-react-native'`  |
| `registerNewUser(data)`            | `useRegisterUser()`                          | `import { useRegisterUser } from 'tf-checkout-react-native'` |
| `checkoutOrder(body)`              | `useCheckout()`                              | `import { useCheckout } from 'tf-checkout-react-native'`     |
| `refreshAccessToken(refreshToken)` | Use token management from `AuthProvider`     | Provided by authentication context                           |
| `stopCartTimer()`                  | Cart timer is managed by `useCheckoutFlow()` | `import { useCheckoutFlow } from 'tf-checkout-react-native'` |

### CheckoutCore Functions

| CheckoutCore Function              | Replacement Hook                                | Import Statement                                                |
| ---------------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| `getEventConditions()`             | `useEventConditions(eventId)`                   | `import { useEventConditions } from 'tf-checkout-react-native'` |
| `getPurchaseOrderDetails(orderId)` | _Not yet implemented as hook_                   | -                                                               |
| `getOrderReview(orderHash)`        | `usePaymentData()`                              | `import { usePaymentData } from 'tf-checkout-react-native'`     |
| `freeRegistration(orderHash)`      | `usePaymentSuccess()` with free ticket handling | `import { usePaymentSuccess } from 'tf-checkout-react-native'`  |
| `paymentSuccess(orderHash)`        | `usePaymentSuccess()`                           | `import { usePaymentSuccess } from 'tf-checkout-react-native'`  |
| `refreshAccessToken(refreshToken)` | Use token management from `AuthProvider`        | Provided by authentication context                              |
| `stopCartTimer()`                  | Cart timer is managed by `useCheckoutFlow()`    | `import { useCheckoutFlow } from 'tf-checkout-react-native'`    |

## Timer Management

The cart expiration timer is now handled automatically by the `useCheckoutFlow()` hook, which provides:

- Automatic timer setup when cart data is fetched
- Countdown management with `secondsLeft` state
- Timer cleanup on component unmount
- Callback for cart expiration via `onCartExpired` prop

## Comprehensive Checkout Flow

For a complete checkout experience, use the `useCheckoutFlow()` hook from `src/features/checkout-v2/hooks/use-checkout.ts`. This hook:

1. Combines all necessary data fetching
2. Manages form state with appropriate validation
3. Handles the complete checkout and payment flow
4. Provides callbacks for various checkout events
5. Supports both single-page and multi-step checkout experiences

## Migration Example

### Before (using BillingCore):

```tsx
import { BillingCore, BillingCoreHandle } from 'tf-checkout-react-native'

const billingRef = useRef<BillingCoreHandle>(null)

useEffect(() => {
  const fetchCart = async () => {
    const cart = await billingRef.current?.getCart()
    // handle cart data
  }
  fetchCart()
}, [])

// Later in the component
<BillingCore ref={billingRef} onCartExpired={handleCartExpired}>
  {/* children */}
</BillingCore>
```

### After (using hooks):

```tsx
import { useCart, useCheckoutFlow } from 'tf-checkout-react-native'

const { data: cart, isLoading } = useCart()
const { secondsLeft } = useCheckoutFlow({
  onCartExpired: handleCartExpired
  // other options
})

// Cart data is available in cart.data.attributes
// secondsLeft provides the remaining cart time
```

## Additional Features in the New Implementation

1. **React Query Integration**: Automatic caching, refetching, and loading states
2. **TypeScript Support**: Full type definitions for all responses and parameters
3. **Composable API**: Use only the hooks you need, when you need them
4. **Form Integration**: Built-in form management with the checkout flow
5. **Payment Processing**: Integrated Stripe payment handling

## Full Example Using the Checkout Flow

```tsx
import { useCheckoutFlow } from 'tf-checkout-react-native'

const CheckoutScreen = () => {
  const {
    onSubmit,
    initialValues,
    countries,
    states,
    orderItems,
    secondsLeft,
    isSubmitting,
    isInitialLoading
  } = useCheckoutFlow({
    onCartExpired: () => navigation.navigate('ExpiredScreen'),
    onCheckoutSuccess: ({ hash, total, values }) => {
      // Handle checkout success
    },
    onPaymentSuccess: (result) => {
      // Handle payment success
    }
  })

  if (isInitialLoading) {
    return <LoadingIndicator />
  }

  return (
    <CheckoutForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      countries={countries}
      states={states}
      orderItems={orderItems}
      secondsLeft={secondsLeft}
      isSubmitting={isSubmitting}
    />
  )
}
```
