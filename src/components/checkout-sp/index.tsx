import React from 'react'

import { LogLevel } from '../../utils/Logger'
import { CheckoutView } from './checkout-view'
import { ICheckoutSPStyles, ICheckoutSPTexts } from './types'
import { useCheckout } from './use-checkout'

interface CheckoutSPProps {
  onPaymentSuccess: (orderData?: {
    orderHash: string
    total: number
    currency?: string
    email?: string
  }) => void
  isAgeRequired?: boolean
  minimumAge?: number
  loginBrandImages?: any
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean
  shouldCartTimerNotMinimizeOnTap?: boolean
  // Shared login state props
  userFirstName?: string
  onLoginSuccess?: (data: any) => void
  onLogoutSuccess?: () => void
  onCartExpired?: () => void

  // Text and Style customization
  texts?: ICheckoutSPTexts
  styles?: ICheckoutSPStyles
  logLevel?: LogLevel
}

const CheckoutSP: React.FC<CheckoutSPProps> = ({
  onPaymentSuccess,
  isAgeRequired,
  minimumAge,
  loginBrandImages,
  areAlertsEnabled = true,
  areLoadingIndicatorsEnabled = true,
  shouldCartTimerNotMinimizeOnTap,
  userFirstName = '',
  onLoginSuccess,
  onLogoutSuccess,
  onCartExpired,
  texts,
  styles,
  logLevel,
}) => {
  const checkoutLogic = useCheckout({
    onPaymentSuccess,
    onLoginSuccess,
    onLogoutSuccess,
    onCartExpired,
    areAlertsEnabled,
    userFirstName,
    logLevel,
  })

  return (
    <CheckoutView
      // Data
      orderInfo={checkoutLogic.orderInfo}
      checkoutData={checkoutLogic.checkoutData}
      availableAddons={checkoutLogic.availableAddons}
      countries={checkoutLogic.countries}
      states={checkoutLogic.states}
      addons={checkoutLogic.addons}
      secondsLeft={checkoutLogic.secondsLeft}
      userProfile={checkoutLogic.userProfile}
      // State
      disabled={checkoutLogic.disabled}
      loggedUserFirstName={checkoutLogic.loggedUserFirstName}
      isLoginDialogVisible={checkoutLogic.isLoginDialogVisible}
      isInitialLoading={checkoutLogic.isInitialLoading}
      // Actions
      onSubmit={checkoutLogic.handleSubmit}
      onAddonChange={checkoutLogic.handleAddonChange}
      onCountryChange={checkoutLogic.loadStatesForCountry}
      onLoginSuccess={checkoutLogic.handleOnLoginSuccess}
      onLoginError={checkoutLogic.handleOnLoginError}
      onLogout={checkoutLogic.handleLogout}
      setIsLoginDialogVisible={checkoutLogic.setIsLoginDialogVisible}
      isAgeRequired={isAgeRequired}
      minimumAge={minimumAge}
      loginBrandImages={loginBrandImages}
      areLoadingIndicatorsEnabled={areLoadingIndicatorsEnabled}
      shouldCartTimerNotMinimizeOnTap={shouldCartTimerNotMinimizeOnTap}
      texts={texts}
      styles={styles}
    />
  )
}

export default CheckoutSP
