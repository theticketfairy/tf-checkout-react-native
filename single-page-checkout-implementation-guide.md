# Single Page Checkout Implementation Guide for React Native

## Overview

This guide provides step-by-step instructions for implementing single page checkout functionality in the React Native tf-checkout app, based on the analysis of the web implementation.

## Phase 1: Core Infrastructure Setup

### 1.1 Add Required Dependencies

```bash
npm install @stripe/stripe-react-native@^0.26.0
# For iOS
cd ios && pod install
```

### 1.2 Update Billing Component Props Interface

```tsx
// src/containers/billingInfo/types.ts
export interface IBillingProps {
  // ... existing props
  
  // New single page checkout props
  isSinglePageCheckout?: boolean
  paymentProps?: {
    stripePublishableKey?: string
    stripeAccountId?: string
    onPaymentSuccess?: (data: any) => void
    onPaymentError?: (error: any) => void
    enableAddressElement?: boolean
    paymentButtonText?: string
  }
  addonsProps?: {
    eventId?: string
    addOnDataWithCustomFields?: any
    onAddOnSelect?: (id: string, value: string, addon: any) => void
  }
  onCheckoutUpdateSuccess?: (data: any) => void
  onCheckoutUpdateError?: (error: any) => void
}
```

### 1.3 Adapt Existing Web Components for React Native

Since you've already added the web components, we'll adapt them for React Native instead of creating from scratch.

#### 1.3.1 Create React Native Payment Container

```tsx
// src/components/paymentContainer/PaymentContainer.tsx
import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CardField, useStripe } from '@stripe/stripe-react-native'

interface PaymentContainerProps {
  stripePublishableKey: string
  stripeAccountId?: string
  onPaymentMethodReady: (paymentMethod: any) => void
  onError: (error: string) => void
  checkoutData: any
  isVisible: boolean
  paymentFields?: any[]
  enableTimer?: boolean
  onCountdownFinish?: () => void
  orderInfoLabel?: string
  paymentInfoLabel?: string
  displayPaymentButton?: boolean
  hidePaymentForm?: boolean
  hideFieldsBlock?: boolean
  stripePaymentProps?: any
}

export const PaymentContainer: React.FC<PaymentContainerProps> = ({
  stripePublishableKey,
  stripeAccountId,
  onPaymentMethodReady,
  onError,
  checkoutData,
  isVisible,
  paymentFields = [],
  enableTimer = false,
  onCountdownFinish,
  orderInfoLabel = 'Order Review',
  paymentInfoLabel = 'Payment Information',
  displayPaymentButton = true,
  hidePaymentForm = false,
  hideFieldsBlock = false,
  stripePaymentProps = {}
}) => {
  const { createPaymentMethod } = useStripe()
  const [paymentMethodReady, setPaymentMethodReady] = useState(false)

  const handleCardChange = async (cardDetails: any) => {
    if (cardDetails.complete && !paymentMethodReady) {
      try {
        const { paymentMethod, error } = await createPaymentMethod({
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: stripePaymentProps.billingDetails || {}
          }
        })

        if (error) {
          onError(error.message)
        } else {
          setPaymentMethodReady(true)
          onPaymentMethodReady(paymentMethod)
        }
      } catch (err) {
        onError('Payment method creation failed')
      }
    }
  }

  if (!isVisible || hidePaymentForm) return null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{paymentInfoLabel}</Text>
      
      {!hideFieldsBlock && (
        <CardField
          postalCodeEnabled={!stripePaymentProps.disableZipSection}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={stripePaymentProps.stripeCardOptions?.style?.base || {
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={styles.cardField}
          onCardChange={handleCardChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
})
```

#### 1.3.2 Adapt SimpleAddonsContainer for React Native

```tsx
// src/components/addonsContainer/SimpleAddonsContainer.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import { Input, Loading } from '../index'

interface SimpleAddonsContainerProps {
  eventId: string
  addOnDataWithCustomFields?: any
  configs?: any
  onAddOnSelect: (id: string, value: string, addon: any) => void
  selectedAddOns?: { [key: string]: number }
  classNamePrefix?: string
  onGetAddonsPageInfoSuccess?: (res: any) => void
  onGetAddonsPageInfoError?: (error: any) => void
  descriptionTrigger?: 'click' | 'hover' | 'always'
}

export const SimpleAddonsContainer: React.FC<SimpleAddonsContainerProps> = ({
  eventId,
  addOnDataWithCustomFields,
  configs,
  onAddOnSelect,
  selectedAddOns = {},
  onGetAddonsPageInfoSuccess,
  onGetAddonsPageInfoError,
  descriptionTrigger = 'click'
}) => {
  const [addons, setAddons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleDescription, setVisibleDescription] = useState<string | null>(null)

  // Adapt the web component's getAddonsPageInfo logic for React Native
  useEffect(() => {
    const getAddonsPageInfo = async () => {
      try {
        if (eventId) {
          setLoading(true)
          
          // Use the same API calls as web component but adapted for RN
          // This would need to be implemented using your existing API client
          const addonsData = await getAddons(eventId)
          
          // Apply the same adapters as web component
          const adaptedAddons = addonsWithGroupsAdapter(addonsData)
          setAddons(adaptedAddons)
          
          onGetAddonsPageInfoSuccess?.(addonsData)
        }
      } catch (e) {
        onGetAddonsPageInfoError?.(e)
      } finally {
        setLoading(false)
      }
    }

    getAddonsPageInfo()
  }, [eventId])

  const handleQuantityChange = useCallback((addonId: string, quantity: string, addon: any) => {
    onAddOnSelect(addonId, quantity, addon)
  }, [onAddOnSelect])

  const handleDescriptionToggle = (addonId: string) => {
    setVisibleDescription(current => current === addonId ? null : addonId)
  }

  const renderAddon = ({ item: addon }: { item: any }) => {
    const isAddonFree = Number(addon?.price) === 0
    const selectedQuantity = selectedAddOns[addon.id] || 0

    return (
      <View style={styles.addonContainer}>
        {addon.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: addon.imageUrl }} style={styles.addonImage} />
          </View>
        )}
        
        <View style={styles.addonInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.addonTitle}>{addon.name}</Text>
            {addon.description && (
              <TouchableOpacity
                onPress={() => handleDescriptionToggle(addon.id)}
                style={styles.infoButton}
              >
                <Text style={styles.infoIcon}>ℹ️</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.addonPrice}>
            {isAddonFree ? 'FREE' : `$${addon.price}`}
            {!isAddonFree && addon.feeIncluded && (
              <Text style={styles.feeText}> (incl. Fees)</Text>
            )}
          </Text>

          {(visibleDescription === addon.id || descriptionTrigger === 'always') && (
            <Text style={styles.description}>{addon.description}</Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Qty:</Text>
          <Input
            value={String(selectedQuantity)}
            onChangeText={(value) => handleQuantityChange(addon.id, value, addon)}
            keyboardType="numeric"
            style={styles.quantityInput}
            placeholder="0"
          />
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    )
  }

  if (!addons.length) return null

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>UPGRADES & ADD-ONS</Text>
      <Text style={styles.subtitle}>PLEASE SELECT FROM THE OPTIONAL ADD-ONS BELOW</Text>
      
      <FlatList
        data={addons}
        renderItem={renderAddon}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  addonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 15,
  },
  addonImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  addonInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  infoButton: {
    padding: 5,
  },
  infoIcon: {
    fontSize: 16,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 5,
  },
  feeText: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  quantityLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  quantityInput: {
    width: 60,
    height: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
})
```

#### 1.3.3 Create API Adapters for React Native

Since the web components use specific adapters, create React Native equivalents:

```tsx
// src/api/adapters.ts
import { getCart } from './index'

export const cartAdapter = (cartResponse: any) => {
  // Adapt cart response to match expected format
  const cartData = cartResponse?.data?.attributes || {}
  return {
    id: cartData.cart?.[0]?.ticket_id || '',
    quantity: cartData.cart?.[0]?.quantity || 0
  }
}

export const addonsWithGroupsAdapter = (addonsData: any) => {
  // Adapt addons data to match expected format
  return addonsData?.data?.map((addon: any) => ({
    id: addon.id,
    name: addon.attributes.name,
    description: addon.attributes.description,
    price: addon.attributes.price,
    cost: addon.attributes.cost,
    currency: addon.attributes.currency,
    imageUrl: addon.attributes.image_url,
    feeIncluded: addon.attributes.fee_included,
    variants: addon.attributes.variants
  })) || []
}

// Add other adapters from web components as needed
export const getTicketRelatedAddons = (addons: any[], ticketId: string) => {
  return addons.filter(addon => 
    !addon.ticket_restrictions || 
    addon.ticket_restrictions.includes(ticketId)
  )
}

export const getSortedAddons = (addons: any[]) => {
  return addons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
```

#### 1.3.4 Update API Client for Add-ons

```tsx
// src/api/index.ts - Add these functions if not already present
export const getAddons = async (eventId: string) => {
  try {
    const response = await ApiClient.get(`/events/${eventId}/addons`)
    return response.data
  } catch (error) {
    throw ErrorHandler.handle(error)
  }
}

export const updateCheckout = async (updateData: any) => {
  try {
    const response = await ApiClient.patch('/checkout', updateData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: ErrorHandler.handle(error) }
  }
}

## Phase 2: Enhanced State Management with Web Component Integration

Since you have the web components available, we can leverage their logic more directly.

### 2.1 Add Single Page Checkout State to Billing Component

```tsx
// In src/containers/billingInfo/Billing.tsx - Add new state variables

const Billing = forwardRef<SessionHandleType, IBillingProps>(
  ({
    // ... existing props
    isSinglePageCheckout = false,
    paymentProps,
    addonsProps,
    onCheckoutUpdateSuccess,
    onCheckoutUpdateError,
  }, ref) => {

    // ... existing state

    // New single page checkout state
    const [selectedAddOns, setSelectedAddOns] = useState<{[key: string]: number}>({})
    const [stripePaymentMethod, setStripePaymentMethod] = useState<any>(null)
    const [checkoutUpdateData, setCheckoutUpdateData] = useState<any>({})
    const [orderIsFree, setOrderIsFree] = useState(false)
    const [paymentError, setPaymentError] = useState<string>('')

    // ... rest of component
```

### 2.2 Add Checkout Update with Add-ons Logic

```tsx
// Add this function to Billing.tsx

const updateCheckoutWithAddOns = useCallback(async (addOns: {[key: string]: number}) => {
  if (!isSinglePageCheckout || !billingCoreRef.current) return

  try {
    setIsLoading(true)
    
    // Call API to update checkout with add-ons
    const updateResult = await billingCoreRef.current.updateCheckout({
      attributes: {
        event_id: addonsProps?.eventId,
        add_ons: addOns,
      }
    })

    if (updateResult.error) {
      onCheckoutUpdateError?.(updateResult.error)
      showAlert(updateResult.error.message)
      return
    }

    setCheckoutUpdateData(updateResult.data)
    setOrderIsFree(!Number(updateResult.data?.total || 0))
    onCheckoutUpdateSuccess?.(updateResult.data)
    
  } catch (error) {
    onCheckoutUpdateError?.(error)
    showAlert('Failed to update checkout')
  } finally {
    setIsLoading(false)
  }
}, [isSinglePageCheckout, addonsProps?.eventId, onCheckoutUpdateSuccess, onCheckoutUpdateError])

const handleAddOnSelect = useCallback(async (id: string, value: string, addon: any) => {
  const quantity = parseInt(value) || 0
  const updatedAddOns = { ...selectedAddOns }
  
  if (quantity > 0) {
    updatedAddOns[id] = quantity
  } else {
    delete updatedAddOns[id]
  }
  
  setSelectedAddOns(updatedAddOns)
  await updateCheckoutWithAddOns(updatedAddOns)
}, [selectedAddOns, updateCheckoutWithAddOns])
```

## Phase 3: Payment Integration

### 3.1 Add Payment Processing Logic

```tsx
// Add to Billing.tsx

const processPayment = async (paymentMethod: any, checkoutData: any) => {
  if (!paymentProps?.stripePublishableKey || orderIsFree) {
    return { success: true }
  }

  try {
    // This would integrate with your payment processing API
    const paymentResult = await billingCoreRef.current.processPayment({
      paymentMethodId: paymentMethod.id,
      orderHash: checkoutData.hash,
      amount: checkoutData.total
    })

    if (paymentResult.error) {
      setPaymentError(paymentResult.error.message)
      paymentProps.onPaymentError?.(paymentResult.error)
      return { success: false, error: paymentResult.error }
    }

    paymentProps.onPaymentSuccess?.(paymentResult.data)
    return { success: true, data: paymentResult.data }
    
  } catch (error) {
    setPaymentError('Payment processing failed')
    paymentProps.onPaymentError?.(error)
    return { success: false, error }
  }
}
```

### 3.2 Update Main Checkout Flow

```tsx
// Replace the existing onSubmit function with this enhanced version

const onSubmit = async () => {
  if (isSinglePageCheckout) {
    return await performSinglePageCheckout()
  }
  
  // Existing multi-step checkout logic
  showErrorMessages({
    firstName: firstName,
    lastName: lastName,
    email: email,
    confirmEmail: emailConfirmation,
    password: password,
    confirmPassword: passwordConfirmation,
    street: street,
    city: city,
    selectedCountry: selectedCountry,
    selectedState: selectedState,
    postalCode: postalCode,
    dateOfBirth: dateOfBirth,
    phoneNumber: phone,
    isRegistering: !loggedUserFirstName && !storedToken.current,
    ticketHolderData: ticketHoldersData,
  })

  const isBasicDataValid = checkBasicDataValid()
  const isExtraDataValidErrors = checkExtraDataValid()

  if (isExtraDataValidErrors || !isBasicDataValid) {
    return
  }

  if (loggedUserFirstName && storedToken.current) {
    await performCheckout()
  } else {
    await performNewUserRegister()
  }
}

const performSinglePageCheckout = async () => {
  try {
    setIsLoading(true)
    
    // 1. Validate form data
    showErrorMessages({
      firstName: firstName,
      lastName: lastName,
      email: email,
      confirmEmail: emailConfirmation,
      password: password,
      confirmPassword: passwordConfirmation,
      street: street,
      city: city,
      selectedCountry: selectedCountry,
      selectedState: selectedState,
      postalCode: postalCode,
      dateOfBirth: dateOfBirth,
      phoneNumber: phone,
      isRegistering: !loggedUserFirstName && !storedToken.current,
      ticketHolderData: ticketHoldersData,
    })

    const isBasicDataValid = checkBasicDataValid()
    const isExtraDataValidErrors = checkExtraDataValid()

    if (isExtraDataValidErrors || !isBasicDataValid) {
      setIsLoading(false)
      return
    }

    // 2. Handle user registration if needed
    if (!loggedUserFirstName && !storedToken.current) {
      const registerResult = await performNewUserRegisterForSinglePage()
      if (!registerResult.success) {
        setIsLoading(false)
        return
      }
    }

    // 3. Create checkout body with add-ons
    const checkoutBody = getCheckoutBody()
    checkoutBody.attributes.add_ons = selectedAddOns

    // 4. Perform checkout
    const { error: checkoutError, data: checkoutData } =
      await billingCoreRef.current.checkoutOrder(checkoutBody)

    if (checkoutError) {
      setIsLoading(false)
      onCheckoutError?.(checkoutError)
      return showAlert(checkoutError.message)
    }

    // 5. Process payment if not free
    if (!orderIsFree && stripePaymentMethod) {
      const paymentResult = await processPayment(stripePaymentMethod, checkoutData)
      if (!paymentResult.success) {
        setIsLoading(false)
        return
      }
    }

    // 6. Complete checkout
    setIsLoading(false)
    billingCoreRef.current.stopCartTimer()
    onCheckoutSuccess(checkoutData)
    
  } catch (error) {
    setIsLoading(false)
    onCheckoutError?.(error)
    showAlert('Checkout failed. Please try again.')
  }
}
```

## Phase 4: UI Integration

### 4.1 Update Billing Component Render Method

```tsx
// Update the return statement in Billing.tsx

return (
  <BillingCore ref={billingCoreRef}>
    <SessionHandle ref={sessionHandleRef} />
    <KeyboardAwareScrollView
      style={[s.rootContainer, styles?.rootContainer]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Existing billing form fields */}
      {/* ... all existing form content ... */}

      {/* Add-ons section for single page checkout */}
      {isSinglePageCheckout && addonsProps && (
        <AddonsContainer
          {...addonsProps}
          onAddOnSelect={handleAddOnSelect}
          selectedAddOns={selectedAddOns}
        />
      )}

      {/* Payment section for single page checkout */}
      {isSinglePageCheckout && !orderIsFree && paymentProps && (
        <PaymentContainer
          {...paymentProps}
          onPaymentMethodReady={setStripePaymentMethod}
          onError={setPaymentError}
          checkoutData={checkoutUpdateData}
          isVisible={true}
        />
      )}

      {/* Payment error display */}
      {paymentError && (
        <View style={s.errorContainer}>
          <Text style={s.errorText}>{paymentError}</Text>
        </View>
      )}

      {/* Submit button with updated text */}
      <Button
        onPress={onSubmit}
        title={
          isSubmittingData || isLoading
            ? texts?.form?.loading || 'Loading...'
            : orderIsFree
            ? texts?.form?.completeRegistration || 'Complete Registration'
            : isSinglePageCheckout
            ? texts?.form?.completePurchase || 'Complete Purchase'
            : texts?.form?.continue || 'Continue'
        }
        style={[s.submitButton, styles?.submitButton]}
        disabled={isSubmittingData || isLoading}
      />

      {/* Existing login modal and other components */}
      {/* ... rest of existing render content ... */}
    </KeyboardAwareScrollView>
  </BillingCore>
)
```

## Phase 5: Core API Updates

### 5.1 Update BillingCore Interface

```tsx
// src/core/BillingCore/BillingCoreTypes.ts
export interface BillingCoreHandle {
  // ... existing methods
  
  // New methods for single page checkout
  updateCheckout: (data: any) => Promise<{ error?: any; data?: any }>
  processPayment: (paymentData: any) => Promise<{ error?: any; data?: any }>
}
```

### 5.2 Implement Core API Methods

```tsx
// In src/core/BillingCore/BillingCore.tsx - add new methods

const updateCheckout = async (updateData: any) => {
  try {
    const response = await ApiClient.patch('/checkout', updateData)
    return { data: response.data }
  } catch (error) {
    return { error: ErrorHandler.handle(error) }
  }
}

const processPayment = async (paymentData: any) => {
  try {
    const response = await ApiClient.post('/payment/process', paymentData)
    return { data: response.data }
  } catch (error) {
    return { error: ErrorHandler.handle(error) }
  }
}

// Add to the useImperativeHandle
useImperativeHandle(ref, () => ({
  // ... existing methods
  updateCheckout,
  processPayment,
}))
```

## Phase 6: Usage Examples

### 6.1 Basic Single Page Checkout Implementation

```tsx
// Example usage in a parent component
import { Billing } from 'tf-checkout-react-native'

const CheckoutScreen = () => {
  const handleCheckoutSuccess = (data) => {
    // Navigate to confirmation screen
    navigation.navigate('Confirmation', { orderData: data })
  }

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData)
  }

  const handleAddOnSelect = (id, value, addon) => {
    console.log('Add-on selected:', { id, value, addon })
  }

  return (
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
        onPaymentSuccess: handlePaymentSuccess,
        onPaymentError: (error) => console.error('Payment error:', error),
      }}
      addonsProps={{
        eventId: 'event_123',
        onAddOnSelect: handleAddOnSelect,
      }}
      onCheckoutSuccess={handleCheckoutSuccess}
      onCheckoutError={(error) => console.error('Checkout error:', error)}
    />
  )
}
```

### 6.2 Conditional Single Page vs Multi-Step

```tsx
const CheckoutFlow = ({ useSinglePage = false }) => {
  if (useSinglePage) {
    return (
      <Billing
        isSinglePageCheckout={true}
        // ... single page props
      />
    )
  }

  // Traditional multi-step flow
  return (
    <Stack.Navigator>
      <Stack.Screen name="Billing" component={BillingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  )
}
```

## Phase 7: Testing Strategy

### 7.1 Unit Tests

```tsx
// __tests__/Billing.singlepage.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Billing } from '../Billing'

describe('Billing Single Page Checkout', () => {
  it('should render payment section when isSinglePageCheckout is true', () => {
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
        addonsProps={{ eventId: 'test', onAddOnSelect: mockOnAddOnSelect }}
        cartProps={{}}
      />
    )
    
    // Test add-on selection logic
  })
})
```

### 7.2 Integration Tests

```tsx
// Test complete single page checkout flow
describe('Single Page Checkout Integration', () => {
  it('should complete full checkout with payment', async () => {
    // Mock Stripe
    // Mock API calls
    // Test full flow from form fill to completion
  })
})
```

## Phase 8: Migration and Rollout

### 8.1 Feature Flag Implementation

```tsx
// Add feature flag support
const useSinglePageCheckout = () => {
  // Check feature flag from config or remote config
  return Config.ENABLE_SINGLE_PAGE_CHECKOUT || false
}

// Use in parent components
const CheckoutContainer = () => {
  const singlePageEnabled = useSinglePageCheckout()
  
  return (
    <Billing
      isSinglePageCheckout={singlePageEnabled}
      // ... other props
    />
  )
}
```

### 8.2 Gradual Rollout Plan

1. **Phase 1**: Implement behind feature flag (disabled by default)
2. **Phase 2**: Enable for internal testing
3. **Phase 3**: A/B test with small percentage of users
4. **Phase 4**: Gradual rollout to all users
5. **Phase 5**: Remove multi-step flow (if desired)

## Conclusion

This implementation guide provides a comprehensive approach to adding single page checkout functionality to the React Native tf-checkout app while maintaining backward compatibility with the existing multi-step flow. The key benefits include:

- **Improved UX**: Single page reduces friction in checkout process
- **Consistent API**: Maintains existing interfaces while adding new functionality  
- **Backward Compatibility**: Existing implementations continue to work
- **Flexible Architecture**: Supports both single-page and multi-step flows
- **Payment Integration**: Seamless Stripe integration for payment processing
- **Add-ons Support**: Real-time pricing updates with add-on selection

The implementation follows React Native best practices and maintains the existing code architecture while adding the necessary enhancements for single page checkout functionality.
