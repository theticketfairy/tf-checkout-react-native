# Single Page Checkout Documentation

## Overview

The Single Page Checkout feature allows users to complete their entire purchase flow on a single screen, including billing information, add-ons selection, and payment processing. This reduces friction and improves conversion rates compared to the traditional multi-step checkout flow.

## Features

- **Unified Experience**: All checkout steps on one page
- **Real-time Updates**: Live pricing updates when selecting add-ons
- **Stripe Integration**: Secure payment processing with Stripe React Native
- **Backward Compatible**: Existing multi-step checkout continues to work
- **Conditional Rendering**: Easy to enable/disable via props
- **Form Validation**: Comprehensive validation for all fields
- **Error Handling**: User-friendly error messages and loading states

## Installation

The single page checkout functionality is built into the existing `tf-checkout-react-native` package. Ensure you have Stripe React Native installed:

```bash
npm install @stripe/stripe-react-native@^0.51.0
# For iOS
cd ios && pod install
```

## Basic Usage

```tsx
import React from 'react'
import { StripeProvider } from '@stripe/stripe-react-native'
import { Billing } from 'tf-checkout-react-native'

const CheckoutScreen = () => {
  return (
    <StripeProvider publishableKey="pk_test_...">
      <Billing
        cartProps={{
          isAgeRequired: true,
          isNameRequired: true,
          isPhoneRequired: true,
          minimumAge: 18,
          isBillingRequired: true,
          isTicketFree: false,
          isPhoneHidden: false,
        }}
        isSinglePageCheckout={true}
        paymentProps={{
          stripePublishableKey: 'pk_test_...',
          stripeAccountId: 'acct_...',
          onPaymentSuccess: (data) => console.log('Payment successful', data),
          onPaymentError: (error) => console.error('Payment failed', error),
        }}
        addonsProps={{
          eventId: 'event_123',
          onAddOnSelect: (id, value, addon) => console.log('Addon selected', { id, value, addon }),
        }}
        onCheckoutSuccess={(data) => {
          // Navigate to confirmation screen
          navigation.navigate('Confirmation', { orderData: data })
        }}
        onCheckoutError={(error) => {
          console.error('Checkout failed', error)
        }}
      />
    </StripeProvider>
  )
}
```

## Props Reference

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isSinglePageCheckout` | `boolean` | No | Enables single page checkout mode (default: `false`) |
| `cartProps` | `ITicketsResponseData` | Yes | Cart configuration and ticket information |

### Payment Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `paymentProps.stripePublishableKey` | `string` | Yes* | Stripe publishable key |
| `paymentProps.stripeAccountId` | `string` | No | Stripe Connect account ID |
| `paymentProps.onPaymentSuccess` | `(data: any) => void` | No | Called when payment succeeds |
| `paymentProps.onPaymentError` | `(error: any) => void` | No | Called when payment fails |
| `paymentProps.enableAddressElement` | `boolean` | No | Enable address collection in payment form |
| `paymentProps.paymentButtonText` | `string` | No | Custom text for payment button |

*Required when `isSinglePageCheckout` is `true` and order is not free

### Add-ons Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `addonsProps.eventId` | `string` | Yes* | Event ID to fetch add-ons for |
| `addonsProps.onAddOnSelect` | `(id: string, value: string, addon: any) => void` | No | Called when add-on is selected |
| `addonsProps.addOnDataWithCustomFields` | `any` | No | Pre-loaded add-on data |

*Required when using add-ons functionality

### Checkout Update Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onCheckoutUpdateSuccess` | `(data: any) => void` | No | Called when checkout is updated successfully |
| `onCheckoutUpdateError` | `(error: any) => void` | No | Called when checkout update fails |

## Advanced Usage

### Conditional Single Page vs Multi-Step

```tsx
const CheckoutFlow = ({ useSinglePage = false }) => {
  const commonProps = {
    cartProps: { /* ... */ },
    onCheckoutSuccess: (data) => navigation.navigate('Confirmation', { data }),
    onCheckoutError: (error) => console.error(error),
    // ... other common props
  }

  if (useSinglePage) {
    return (
      <Billing
        {...commonProps}
        isSinglePageCheckout={true}
        paymentProps={{
          stripePublishableKey: 'pk_test_...',
          onPaymentSuccess: (data) => console.log('Payment successful'),
          onPaymentError: (error) => console.error('Payment failed'),
        }}
        addonsProps={{
          eventId: 'event_123',
          onAddOnSelect: (id, value, addon) => console.log('Addon selected'),
        }}
      />
    )
  }

  // Traditional multi-step flow
  return <Billing {...commonProps} />
}
```

### Feature Flag Implementation

```tsx
import { Config } from './config'

const CheckoutContainer = () => {
  const singlePageEnabled = Config.ENABLE_SINGLE_PAGE_CHECKOUT || false
  
  return (
    <CheckoutFlow useSinglePage={singlePageEnabled} />
  )
}
```

### Custom Styling

```tsx
<Billing
  isSinglePageCheckout={true}
  styles={{
    rootContainer: {
      paddingHorizontal: 20,
      backgroundColor: '#f8f9fa',
    },
    checkoutButton: {
      container: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
      },
      text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
      },
    },
  }}
  texts={{
    checkoutButton: 'Complete Purchase',
    form: {
      completePurchase: 'Complete Purchase',
      completeRegistration: 'Complete Registration',
      loading: 'Processing...',
    },
  }}
  // ... other props
/>
```

## API Integration

### Add-ons API

The component automatically fetches add-ons using the provided `eventId`:

```
GET /events/{eventId}/addons
```

Expected response format:

```json
{
  "data": [
    {
      "id": "addon_1",
      "attributes": {
        "name": "VIP Package",
        "description": "Includes premium seating and drinks",
        "price": "50.00",
        "currency": "USD",
        "image_url": "https://...",
        "fee_included": true
      }
    }
  ]
}
```

### Checkout Update API

When add-ons are selected, the component calls:

```
PATCH /checkout
```

With payload:

```json
{
  "attributes": {
    "event_id": "event_123",
    "add_ons": {
      "addon_1": 2,
      "addon_2": 1
    }
  }
}
```

### Payment Processing API

For payment processing:

```http
POST /payment/process
```

With payload:

```json
{
  "paymentMethodId": "pm_...",
  "orderHash": "order_hash_123",
  "amount": "150.00"
}
```

## Error Handling

The component provides comprehensive error handling:

```tsx
<Billing
  isSinglePageCheckout={true}
  onCheckoutError={(error) => {
    // Handle checkout errors
    Alert.alert('Checkout Error', error.message)
  }}
  onCheckoutUpdateError={(error) => {
    // Handle add-on update errors
    console.error('Failed to update add-ons:', error)
  }}
  paymentProps={{
    onPaymentError: (error) => {
      // Handle payment errors
      Alert.alert('Payment Error', error.message)
    },
  }}
  // ... other props
/>
```

## Testing

### Unit Testing

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Billing } from 'tf-checkout-react-native'

describe('Single Page Checkout', () => {
  it('should render payment section when enabled', () => {
    const { getByText } = render(
      <Billing
        isSinglePageCheckout={true}
        paymentProps={{ stripePublishableKey: 'pk_test_123' }}
        cartProps={{}}
      />
    )
    
    expect(getByText('Payment Information')).toBeTruthy()
  })

  it('should handle add-on selection', async () => {
    const mockOnAddOnSelect = jest.fn()
    const { getByTestId } = render(
      <Billing
        isSinglePageCheckout={true}
        addonsProps={{ 
          eventId: 'test', 
          onAddOnSelect: mockOnAddOnSelect 
        }}
        cartProps={{}}
      />
    )
    
    // Test add-on selection logic
    // ...
  })
})
```

### Integration Testing

```tsx
describe('Single Page Checkout Integration', () => {
  it('should complete full checkout with payment', async () => {
    // Mock Stripe
    jest.mock('@stripe/stripe-react-native', () => ({
      useStripe: () => ({
        createPaymentMethod: jest.fn().mockResolvedValue({
          paymentMethod: { id: 'pm_test' }
        })
      })
    }))

    // Mock API calls
    jest.mock('../api/ApiClient', () => ({
      fetchAddons: jest.fn().mockResolvedValue({ addonsData: [] }),
      updateCheckoutWithAddons: jest.fn().mockResolvedValue({ data: {} }),
      processPayment: jest.fn().mockResolvedValue({ data: {} }),
    }))

    // Test full flow from form fill to completion
    // ...
  })
})
```

## Migration Guide

### From Multi-Step to Single Page

1. **Enable the feature gradually**:

   ```tsx
   const useSinglePage = userIsInTestGroup() // A/B testing
   ```

2. **Update your navigation**:

   ```tsx
   // Before: Navigate through multiple screens
   // After: Single screen with all functionality
   ```

3. **Handle new callbacks**:

   ```tsx
   // Add new event handlers for payment and add-ons
   onCheckoutUpdateSuccess={(data) => updateUI(data)}
   ```

### Rollout Strategy

1. **Phase 1**: Implement behind feature flag (disabled by default)
2. **Phase 2**: Enable for internal testing
3. **Phase 3**: A/B test with small percentage of users
4. **Phase 4**: Gradual rollout to all users
5. **Phase 5**: Remove multi-step flow (if desired)

## Troubleshooting

### Common Issues

**Payment not processing**:

- Ensure Stripe publishable key is correct
- Verify Stripe account configuration
- Check network connectivity

**Add-ons not loading**:

- Verify eventId is correct
- Check API endpoint availability
- Ensure proper authentication

**Checkout updates failing**:

- Verify API endpoint configuration
- Check request payload format
- Ensure proper error handling

### Debug Mode

Enable debug logging:

```tsx
<Billing
  isSinglePageCheckout={true}
  onCheckoutUpdateSuccess={(data) => {
    console.log('DEBUG: Checkout updated', data)
  }}
  onCheckoutUpdateError={(error) => {
    console.error('DEBUG: Checkout update failed', error)
  }}
  // ... other props
/>
```

## Performance Considerations

- **Lazy Loading**: Add-ons are loaded only when needed
- **Debounced Updates**: Checkout updates are debounced to prevent excessive API calls
- **Optimistic UI**: UI updates immediately while API calls happen in background
- **Error Recovery**: Graceful fallbacks when API calls fail

## Security

- **PCI Compliance**: Payment data is handled securely by Stripe
- **API Security**: All API calls use proper authentication
- **Data Validation**: All inputs are validated on both client and server
- **Error Handling**: Sensitive information is not exposed in error messages

## Browser Support

The single page checkout supports the same platforms as React Native:

- iOS 11.0+
- Android API level 21+
- React Native 0.60+

## Contributing

When contributing to single page checkout functionality:

1. Follow existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Ensure backward compatibility
5. Test on both iOS and Android

## Support

For issues related to single page checkout:

1. Check this documentation
2. Review the example implementations
3. Check the troubleshooting section
4. Create an issue with reproduction steps
