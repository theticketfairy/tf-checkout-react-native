# Changelog

All notable changes to this project will be documented in this file.

## [1.0.38] - 2025-09-11

### Added

- **Single Page Checkout**: Complete implementation of single page checkout functionality with feature parity to tf-checkout-react web version
- **SimpleBillingForm**: New React Native form component with validation using basic React Native components
- **SinglePageCheckoutContainer**: 3-step checkout flow (Billing → Add-ons → Payment) with progress indicator
- **Enhanced PaymentContainer**: Payment plans support, timer widget, and order details integration
- **OrderDetails**: Mobile-responsive order summary with collapsible sections
- **PaymentPlanSection**: Installment payment configuration with saved cards support
- **TimerWidget**: Cart expiration countdown with visual warnings
- **ErrorDisplay**: Enhanced error handling with severity levels
- **Currency Normalizers**: Utility functions for consistent currency formatting
- **Enhanced API Client**: Added fetchAddons, updateCheckoutWithAddons, processPayment endpoints
- **Comprehensive Form Validation**: Real-time validation and error handling
- **Stripe Integration**: Full Stripe payment processing with CardField component
- **Mobile-Optimized UI**: Responsive design with collapsible sections for mobile devices

### Enhanced

- **BillingCore**: Added updateCheckout and processPayment methods
- **Billing Component**: Enhanced with single page checkout logic and conditional UI rendering
- **IBillingProps**: Extended interface with single page checkout properties
- **API Integration**: Improved data transformation and API integration layer
- **Error Handling**: Comprehensive error handling throughout the checkout flow

### Fixed

- **React Hooks Error**: Resolved "Cannot read property 'useState' of null" error by creating SimpleBillingForm
- **Import Order Issues**: Fixed component import order problems
- **Component Interface Mismatches**: Resolved interface compatibility issues
- **Missing Dependencies**: Added formik and yup to package.json
- **Native Module Build Errors**: Resolved build compatibility issues

### Updated

- **Documentation**: Comprehensive updates to README.md with current version requirements
- **React Native**: Updated to version 0.72.9
- **React**: Updated to version 18.1.0
- **Node.js**: Minimum requirement updated to 20.18.3+
- **iOS**: Minimum deployment target updated to iOS 13.0+
- **Pods**: Updated minimum version to 1.15.0+
- **Example App**: Updated example project with working configuration
- **Setup Instructions**: Updated installation and setup documentation

### Technical Improvements

- **Backward Compatibility**: Maintained compatibility with existing multi-step checkout
- **Real-time Updates**: Add-on selection with real-time pricing updates
- **Dynamic UI**: Conditional rendering based on isSinglePageCheckout prop
- **Loading States**: Comprehensive loading indicators and states
- **Terms and Conditions**: Added checkbox support for terms acceptance
- **Free Tickets Flow**: Special handling for free ticket purchases
- **Table Types Support**: Added support for seating arrangements

### Dependencies

- Added `formik ^2.4.5` for form management
- Added `yup ^1.4.0` for form validation
- Updated `@stripe/stripe-react-native` to ^0.39.0
- Updated various peer dependencies for compatibility

## [Previous Versions]

### [1.0.37] and earlier

- Initial React Native library implementation
- Basic checkout flow components
- Authentication and user management
- Order management and PDF downloads
- Ticket resale functionality
- Multi-step checkout process
