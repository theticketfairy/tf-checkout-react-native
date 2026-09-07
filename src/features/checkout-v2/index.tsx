import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  ScrollViewScrollToOptions,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CartTimer, FormField, Login } from '../../components';
import { ICartTimerStyles } from '../../components/cartTimer/types';
import {
  ILoginBrandImages,
  ILoginSuccessData,
  ILoginViewStyles,
} from '../../components/login/types';
import { IError } from '../../types';
import { logger } from '../../utils/Logger';
import { useUserProfile } from '../auth/api-hooks';
import { IRegisterUserResponse } from '../auth/types';
import { CheckoutForm, PaymentForm } from './form';
import { CheckoutFormStyles } from './form/styles';
import { ICheckoutSuccessData, useCheckoutFlow } from './hooks/use-checkout';
import { CheckoutTexts, OrderResult } from './types';
import { StripeProvider } from '@stripe/stripe-react-native';

export interface CheckoutV2Props {
  isSinglePageCheckout?: boolean;
  onCartExpired?: () => void;
  onCheckoutSuccess?: (data: ICheckoutSuccessData) => void;
  onCheckoutError?: (error: any) => void;
  onPaymentSuccess?: (data: OrderResult) => void;
  onPaymentError?: (error: any) => void;
  onLoginSuccess?: (data: ILoginSuccessData) => void;
  onLoginError?: (error: any) => void;
  onLogoutSuccess?: () => void;
  onRegistrationSuccess?: (data: IRegisterUserResponse) => void;
  onRegistrationError?: (error: any) => void;
  isAgeRequired?: boolean;
  minimumAge?: number;
  isPhoneRequired?: boolean;
  isPhoneHidden?: boolean;
  loginBrandImages?: ILoginBrandImages;
  styles?: CheckoutStyles;
  texts?: CheckoutTexts;
}

export interface CheckoutStyles {
  container?: StyleProp<ViewStyle>;
  contentContainer?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  login?: ILoginViewStyles;
  cartTimer?: ICartTimerStyles;
  form?: CheckoutFormStyles;
  paymentForm?: CheckoutFormStyles;
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
});

export const CheckoutController = ({
  isSinglePageCheckout = true,
  onCartExpired: _onCartExpired,
  onCheckoutSuccess: _onCheckoutSuccess,
  onCheckoutError: _onCheckoutError,
  onPaymentSuccess: _onPaymentSuccess,
  onPaymentError: _onPaymentError,
  onLoginSuccess: _onLoginSuccess,
  onLoginError: _onLoginError,
  onLogoutSuccess: _onLogoutSuccess,
  onRegistrationSuccess: _onRegistrationSuccess,
  onRegistrationError: _onRegistrationError,
  isAgeRequired = false,
  minimumAge = 18,
  isPhoneRequired = false,
  isPhoneHidden = false,
  loginBrandImages,
  styles: stylesProp,
  texts: textsProp,
}: CheckoutV2Props) => {
  const scrollRef = useRef<{
    scrollTo: (options: ScrollViewScrollToOptions) => void;
  }>(null);
  const [checkoutSuccessData, setCheckoutSuccessData] = useState<ICheckoutSuccessData>();
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false);
  const formTexts = textsProp?.form;
  const loginTexts = useMemo(() => {
    const baseLogin = textsProp?.login;
    const baseDialog = baseLogin?.dialog ?? {};
    const dialogMessage = loginMessage || baseDialog.message;

    if (!baseLogin && !dialogMessage) {
      return undefined;
    }

    return {
      ...baseLogin,
      dialog: {
        ...baseDialog,
        message: dialogMessage,
      },
    };
  }, [loginMessage, textsProp]);

  const cartTimerTexts = textsProp?.cartTimer;

  const { data: userProfile, invalidate } = useUserProfile();

  const onCheckoutSuccess = useCallback(
    (data: ICheckoutSuccessData) => {
      setCheckoutSuccessData(data);
      _onCheckoutSuccess?.(data);
    },
    [_onCheckoutSuccess]
  );

  const onRegistrationSuccess = useCallback(
    (data: IRegisterUserResponse) => {
      _onRegistrationSuccess?.(data);
      invalidate();
    },
    [_onRegistrationSuccess, invalidate]
  );

  const onRegistrationError = useCallback(
    (error: any) => {
      logger.error('[CheckoutController] Registration failed:', { error });
      _onRegistrationError?.(error);
      // Show login dialog
      setLoginMessage(error);
      setIsLoginDialogVisible(true);
    },
    [_onRegistrationError]
  );

  const checkoutFlow = useCheckoutFlow({
    onCheckoutSuccess,
    onCartExpired: _onCartExpired,
    onCheckoutError: _onCheckoutError,
    onPaymentError: _onPaymentError,
    onPaymentSuccess: _onPaymentSuccess,
    onRegistrationSuccess,
    onRegistrationError,
    isPhoneRequired,
    isAgeRequired,
    isPhoneHidden,
    minimumAge,
    isSinglePageCheckout,
    customerProfile: userProfile?.data,
  });

  const { secondsLeft } = checkoutFlow;

  const handleLoginError = (error: IError) => {
    logger.error('[CheckoutController] Login error:', { error });
    _onLoginError?.(error);
  };

  const handleLogout = () => {
    logger.debug('[CheckoutController] User logged out');
    invalidate();
    _onLogoutSuccess?.();
  };

  const handleLoginSuccess = useCallback(
    (data: ILoginSuccessData) => {
      logger.debug('[CheckoutController] Login successful', { email: data?.userProfile?.email });
      invalidate();
      _onLoginSuccess?.(data);
      setIsLoginDialogVisible(false);
    },
    [_onLoginSuccess, invalidate]
  );

  const containerStyle = StyleSheet.flatten([
    defaultStyles.container,
    stylesProp?.container,
  ]) as StyleProp<ViewStyle>;

  const contentContainerStyle = StyleSheet.flatten([
    defaultStyles.contentContainer,
    stylesProp?.contentContainer,
  ]) as StyleProp<ViewStyle>;

  const titleStyle = StyleSheet.flatten([
    defaultStyles.title,
    stylesProp?.title,
  ]) as StyleProp<TextStyle>;

  return (
    <>
      <KeyboardAwareScrollView
        innerRef={(ref) => (scrollRef.current = ref)}
        style={containerStyle}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={false}
        extraScrollHeight={0}
      >
        {/* Login Component */}
        <Login
          onLoginSuccessful={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogoutSuccess={handleLogout}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={() => setIsLoginDialogVisible(true)}
          hideLoginDialog={() => {
            setIsLoginDialogVisible(false);
            setLoginMessage('');
          }}
          userFirstName={userProfile?.data?.firstName}
          brandImages={loginBrandImages}
          texts={loginTexts}
          styles={stylesProp?.login}
        />
        <FormField
          fieldType="title"
          title={formTexts?.form?.sectionTitle || 'Personal Information'}
          titleStyle={titleStyle}
        />

        {/* Use our new CheckoutForm component */}
        {checkoutFlow.checkoutData?.attributes?.additional_payment_information?.basic_config?.apiKey ? (
          <StripeProvider
            publishableKey={
              checkoutFlow.checkoutData.attributes
                .additional_payment_information.basic_config.apiKey
            }
            stripeAccountId={
              checkoutFlow.checkoutData.attributes
                .additional_payment_information.basic_config.accountId ||
              undefined
            }
          >
          {isSinglePageCheckout || !checkoutSuccessData ? (
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
                await checkoutFlow.handlePayment(checkoutSuccessData)
              }
              orderItems={checkoutFlow.orderItems}
            />
          )}
        </StripeProvider>
        ) : null}
      </KeyboardAwareScrollView>

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
  );
};

const queryClient = new QueryClient();

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
