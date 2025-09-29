# CheckoutCore (Deprecated)

> ⚠️ **DEPRECATED**: This component is deprecated and will be removed in a future release.

## Migration Guide

Please use the hooks directly from the package, which are all exported from the root.

See the [Migration Guide](../MIGRATION.md) for detailed instructions on how to replace CheckoutCore functions with the new hooks-based implementation.

## Function Replacements

| CheckoutCore Function         | Replacement Hook                                                     |
| ----------------------------- | -------------------------------------------------------------------- |
| `getEventConditions()`        | `useEventConditions(eventId)` from `tf-checkout-react-native`        |
| `getOrderReview(orderHash)`   | `usePaymentData()` from `tf-checkout-react-native`                   |
| `freeRegistration(orderHash)` | `usePaymentSuccess()` with free ticket handling in `useCheckoutFlow` |
| `paymentSuccess(orderHash)`   | `usePaymentSuccess()` from `tf-checkout-react-native`                |

For a comprehensive checkout experience, use `useCheckoutFlow()` from `tf-checkout-react-native`.
