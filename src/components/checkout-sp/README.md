# CheckoutSP - Single-Page Checkout Component

## Overview

The CheckoutSP component provides a streamlined checkout experience that combines billing information collection, order review, payment processing, and marketing opt-ins into a single view. It's designed to match the styling and behavior of the original two-step checkout process for consistency.

## How it works

- Allows users to enter billing and payment details in a single form
- Renders the same OrderReview component as the standard checkout
- Processes payments via Stripe's React Native CardForm element
- Supports all customization options (texts/styles) from the original checkout flow
- Manages user authentication, validation, and error handling

## Usage

```tsx
import { CheckoutSP } from 'tf-checkout-react-native'

// Basic usage
<CheckoutSP
  onPaymentSuccess={(orderData) => {
    // Handle successful payment
    console.log(orderData.orderHash)
  }}
  isAgeRequired={true}
  minimumAge={18}
  userFirstName={userFirstName}
  onLoginSuccess={handleLoginSuccess}
  onLogoutSuccess={handleLogout}
/>

// With styling and custom text labels
<CheckoutSP
  onPaymentSuccess={handlePaymentSuccess}
  isAgeRequired={true}
  texts={{
    title: 'GET YOUR TICKETS',
    subTitle: 'Order review',
    providePaymentInfo: 'Enter Payment Details',
  }}
  styles={{
    payment: {
      cardContainer: { /* Stripe card styles */ },
      cardStyle: { backgroundColor: '#FFFFFF', textColor: '#000000' }
    },
    orderReview: { /* Order review styles */ }
  }}
/>
```

## Key Features

- **Single Page Flow**: Combines billing info and payment in one screen
- **Consistent Styling**: Matches the look and feel of the two-step checkout process
- **Customizable**: Supports all the same styling and text options as other components
- **Stripe Integration**: Uses Stripe CardForm for payment processing
- **Responsive Design**: Adapts to different screen sizes and orientations
