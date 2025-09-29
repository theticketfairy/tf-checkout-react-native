# BillingCore (Deprecated)

> ⚠️ **DEPRECATED**: This component is deprecated and will be removed in a future release.

## Migration Guide

Please use the hooks directly from the package, which are all exported from the root.

See the [Migration Guide](../MIGRATION.md) for detailed instructions on how to replace BillingCore functions with the new hooks-based implementation.

## Function Replacements

| BillingCore Function    | Replacement Hook                                       |
| ----------------------- | ------------------------------------------------------ |
| `getCart()`             | `useCart()` from `tf-checkout-react-native`            |
| `getCountries()`        | `useCountries()` from `tf-checkout-react-native`       |
| `getStates(countryId)`  | `useStates(countryId)` from `tf-checkout-react-native` |
| `getUserProfile()`      | `useUserProfile()` from `tf-checkout-react-native`     |
| `registerNewUser(data)` | `useRegisterUser()` from `tf-checkout-react-native`    |
| `checkoutOrder(body)`   | `useCheckout()` from `tf-checkout-react-native`        |

For a comprehensive checkout experience, use `useCheckoutFlow()` from `tf-checkout-react-native`.
