import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { CartTimer, FormField, Login } from '../../components'
import { ICartTimerStyles } from '../../components/cartTimer/types'
import {
  ILoginBrandImages,
  ILoginSuccessData,
  ILoginViewStyles,
} from '../../components/login/types'
import { IError } from '../../types'
import { useRegisterUser, useUserProfile } from '../auth/api-hooks'
import { storeAuthTokens } from '../auth/utils'
import { CheckoutForm, PaymentForm } from './form'
import { CheckoutFormStyles } from './form/styles'
import { CheckoutFormValues } from './form/types'
import { CheckoutData, useCheckoutFlow } from './hooks/use-checkout'
import { CheckoutTexts, OrderResult } from './types'
import { createRegistrationData } from './utils'

export interface CheckoutV2Props {
  isSinglePageCheckout?: boolean
  onCartExpired?: () => void
  onCheckoutSuccess?: (data: CheckoutData) => void
  onCheckoutError?: (error: any) => void
  onPaymentSuccess?: (data: OrderResult) => void
  onPaymentError?: (error: any) => void
  onLoginSuccess?: (data: ILoginSuccessData) => void
  onLoginError?: (error: any) => void
  onLogoutSuccess?: () => void
  isAgeRequired?: boolean
  minimumAge?: number
  isPhoneRequired?: boolean
  isPhoneHidden?: boolean
  loginBrandImages?: ILoginBrandImages
  styles?: CheckoutStyles
  texts?: CheckoutTexts
}

export interface CheckoutStyles {
  container?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  login?: ILoginViewStyles
  cartTimer?: ICartTimerStyles
  form?: CheckoutFormStyles
  paymentForm?: CheckoutFormStyles
}

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})

export const CheckoutControllerRaw = ({
  isSinglePageCheckout = true,
  onCartExpired: _onCartExpired,
  onCheckoutSuccess: _onCheckoutSuccess,
  onCheckoutError: _onCheckoutError,
  onPaymentSuccess: _onPaymentSuccess,
  onPaymentError: _onPaymentError,
  onLoginSuccess: _onLoginSuccess,
  onLoginError: _onLoginError,
  onLogoutSuccess: _onLogoutSuccess,
  isAgeRequired = false,
  minimumAge = 18,
  isPhoneRequired = false,
  isPhoneHidden = false,
  loginBrandImages,
  styles: stylesProp,
  texts: textsProp,
}: CheckoutV2Props) => {
  const scrollRef = useRef<ScrollView>(null)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>()
  const [loginMessage, setLoginMessage] = useState('')
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)

  const formTexts = textsProp?.form
  const loginTexts = useMemo(() => {
    const baseLogin = textsProp?.login
    const baseDialog = baseLogin?.dialog ?? {}
    const dialogMessage = loginMessage || baseDialog.message

    if (!baseLogin && !dialogMessage) {
      return undefined
    }

    return {
      ...baseLogin,
      dialog: {
        ...baseDialog,
        message: dialogMessage,
      },
    }
  }, [loginMessage, textsProp])

  const cartTimerTexts = textsProp?.cartTimer

  const { data: userProfile, invalidate } = useUserProfile()
  const registerUserMutation = useRegisterUser()
  // Helper function to handle registration error
  const handleRegistrationError = useCallback((registerError: any): boolean => {
    // Check for already registered user (422 status)
    if (registerError?.response?.status === 422) {
      const errorData = registerError.response?.data

      // Check all possible email error structures
      const emailErrors =
        errorData?.errors?.email ||
        errorData?.data?.message?.email ||
        (errorData?.message?.email ? errorData.message.email : null)

      if (emailErrors) {
        // Show login dialog for already registered user
        const emailAlreadyRegisteredText =
          'It appears this email is already attached to an account. Please log in here to complete your registration.'

        let errorMessage: string
        if (Array.isArray(emailErrors)) {
          errorMessage = emailErrors[0]
        } else if (typeof emailErrors === 'string') {
          errorMessage = emailErrors
        } else {
          errorMessage = emailAlreadyRegisteredText
        }

        if (errorMessage === 'The email is already used') {
          errorMessage = emailAlreadyRegisteredText
        }

        // Show login dialog
        setLoginMessage(errorMessage)
        setIsLoginDialogVisible(true)
        return true // Registration handled, don't continue with checkout
      } else {
        // Other validation errors
        const errorMessages = Object.entries(errorData?.errors || {})
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(', ') : messages
              }`
          )
          .join('\n')
        throw new Error(`Validation errors: ${errorMessages}`)
      }
    }

    // Generic error
    throw new Error(registerError?.message || 'Registration failed')
  }, [])

  const registerUser = useCallback(
    async (values: CheckoutFormValues): Promise<boolean> => {
      try {
        // User is already registered or logged in, skip registration
        if (userProfile?.data) {
          return true
        }
        // Create and submit registration data
        const registerUserData = createRegistrationData(values, isAgeRequired)
        const result = await registerUserMutation.mutateAsync(registerUserData)

        // Store tokens and extract user data
        await storeAuthTokens(result.data.attributes)

        invalidate()

        // Registration successful
        return true
      } catch (registerError: any) {
        return !handleRegistrationError(registerError)
      }
    },
    [
      userProfile?.data,
      isAgeRequired,
      registerUserMutation,
      invalidate,
      handleRegistrationError,
    ]
  )

  const onCheckoutSuccess = useCallback(
    (data: CheckoutData) => {
      setCheckoutData(data)
      _onCheckoutSuccess?.(data)
    },
    [_onCheckoutSuccess]
  )

  const checkoutFlow = useCheckoutFlow({
    onCheckoutSuccess,
    onCartExpired: _onCartExpired,
    onBeforeSubmit: registerUser,
    onCheckoutError: _onCheckoutError,
    onPaymentError: _onPaymentError,
    onPaymentSuccess: _onPaymentSuccess,
    isPhoneRequired,
    isAgeRequired,
    isPhoneHidden,
    minimumAge,
    isSinglePageCheckout,
    customerProfile: userProfile?.data,
  })

  const { setSelectedCountry, secondsLeft } = checkoutFlow

  const handleLoginError = (error: IError) => {
    _onLoginError?.(error)
  }

  const handleLogout = () => {
    invalidate()
    _onLogoutSuccess?.()
  }

  const handleLoginSuccess = useCallback(
    (data: ILoginSuccessData) => {
      invalidate()
      _onLoginSuccess?.(data)
      setIsLoginDialogVisible(false)
    },
    [_onLoginSuccess, invalidate]
  )

  useEffect(() => {
    if (userProfile?.data) {
      const profile = userProfile.data
      if (profile.countryId) {
        setSelectedCountry(profile.countryId.toString())
      }
    }
  }, [setSelectedCountry, userProfile])

  const containerStyle = StyleSheet.flatten([
    defaultStyles.container,
    stylesProp?.container,
  ]) as StyleProp<ViewStyle>
  const contentContainerStyle = StyleSheet.flatten([
    defaultStyles.contentContainer,
    stylesProp?.contentContainer,
  ]) as StyleProp<ViewStyle>
  const titleStyle = StyleSheet.flatten([
    defaultStyles.title,
    stylesProp?.title,
  ]) as StyleProp<TextStyle>

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={containerStyle}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps='handled'
      >
        {/* Login Component */}
        <Login
          onLoginSuccessful={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogoutSuccess={handleLogout}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={() => setIsLoginDialogVisible(true)}
          hideLoginDialog={() => {
            setIsLoginDialogVisible(false)
            setLoginMessage('')
          }}
          userFirstName={userProfile?.data?.firstName}
          brandImages={loginBrandImages}
          texts={loginTexts}
          styles={stylesProp?.login}
        />

        <FormField
          fieldType='title'
          title={formTexts?.form?.sectionTitle || 'Personal Information'}
          titleStyle={titleStyle}
        />

        {/* Use our new CheckoutForm component */}
        {isSinglePageCheckout || !checkoutData ? (
          <CheckoutForm
            scrollRef={scrollRef}
            styles={stylesProp?.form}
            texts={formTexts}
            {...checkoutFlow}
          />
        ) : (
          <PaymentForm
            scrollRef={scrollRef}
            styles={stylesProp?.paymentForm ?? stylesProp?.form}
            texts={formTexts}
            onSubmit={async () =>
              await checkoutFlow.handlePayment(checkoutData)
            }
            orderItems={checkoutFlow.orderItems}
          />
        )}
      </ScrollView>

      {/* Cart Timer */}
      {typeof secondsLeft === 'number' && secondsLeft > 0 && (
        <CartTimer
          secondsLeft={secondsLeft}
          shouldNotMinimize={false}
          styles={stylesProp?.cartTimer}
          texts={cartTimerTexts}
        />
      )}
    </>
  )
}

const queryClient = new QueryClient()

export const CheckoutControllerWrapper = (props: CheckoutV2Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CheckoutControllerRaw {...props} />
    </QueryClientProvider>
  )
}
