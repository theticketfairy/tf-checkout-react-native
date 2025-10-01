import { IMyOrderDetailsTicket } from './api/types';
import {
  ICheckoutBody,
  IEventResponse,
  IMyOrderDetailsData,
  IMyOrdersOrder,
  IPromoCodeResponse,
  IPurchaseConfirmationData,
  IRegisterNewUserBody,
  MyOrderRequestFromType,
} from './api/types';
import {
  CartTimer,
  Dropdown,
  DropdownMaterial,
  Loading,
  LoggedIn,
  Login,
  PromoCode,
  WaitingList,
} from './components';
import { IDropdownStyles } from './components/dropdown/types';
import { ILoadingStyles } from './components/loading/types';
import { ILoginSuccessData } from './components/login/types';
import {
  BillingInfo,
  Checkout,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  ResaleTickets,
  ResetPassword,
  Tickets,
} from './containers';
import { CheckoutData } from './features/checkout-v2/hooks/use-checkout';
import { IConfig } from './helpers/Config'
import { IMyOrderDetailsProps } from './containers/myOrderDetails/types';
import { IMyOrdersProps } from './containers/myOrders/types';
import { IPurchaseConfirmationProps } from './containers/purchaseConfirmation/types';
import { IResaleTicketsProps } from './containers/resaleTickets/types';
import {
  IPasswordProtectedEventData,
  ITicketsProps,
} from './containers/tickets/types';
import {
  BillingCore,
  BillingCoreHandle,
  CheckoutCore,
  CheckoutCoreHandle,
  LoginCore,
  LoginCoreHandle,
  MyOrdersCore,
  MyOrdersCoreHandle,
  OrderDetailsCore,
  OrderDetailsCoreHandle,
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
  ResetPasswordCore,
  ResetPasswordCoreHandle,
  SessionCoreHandleType,
  SessionHandleType,
  TicketsCore,
  TicketsCoreHandle,
  WaitingListCore,
  WaitingListCoreHandle,
} from './core';
import {
  IBookTicketsOptions,
  IGetTicketsPayload,
  IGroupedTickets,
} from './core/TicketsCore/TicketsCoreTypes';
import { useRegisterUser, useUserProfile } from './features/auth/api-hooks';
import {
  CheckoutController as CheckoutV2,
  CheckoutProvider,
  CheckoutStyles,
} from './features/checkout-v2';
import { CheckoutForm, PaymentForm } from './features/checkout-v2/form';
import {
  useAddons,
  useAddToCart,
  useCart,
  useCheckout,
  useEventConditions,
  useEventInfo,
  usePaymentData,
  usePaymentSuccess,
  useTickets,
  useUpdateCheckout,
} from './features/checkout-v2/hooks/api-hooks';
import { useCheckoutFlow } from './features/checkout-v2/hooks/use-checkout';
import { CheckoutTexts } from './features/checkout-v2/types';
import { useCountries, useStates } from './features/geo/api-hooks';
import { setConfig } from './helpers/Config';
import { deleteAllData, deleteUserData } from './helpers/LocalStorage';
import { refreshAccessToken } from './helpers/RefreshAccessToken';
import {
  IAccountOrdersPurchasedEvent,
  IAccountOrdersTicket,
  IAccountTicketsAttributes,
  IAccountTicketsData,
  IAccountTicketsResponse,
  IAddToCartResponse,
  IError,
  IEvent,
  ISelectedTicket,
  ITicket,
  ITicketsResponseData,
  IUserProfile,
} from './types';

import { LogBox, NativeModules } from 'react-native';

LogBox.ignoreAllLogs();

export {
  /**
   * @deprecated Use hooks like useCart(), useCheckout(), etc. imported directly from 'tf-checkout-react-native'. See core/MIGRATION.md
   */
  BillingCore,
  /**
   * @deprecated Use hooks like useCart(), useCheckout(), etc. imported directly from 'tf-checkout-react-native'. See core/MIGRATION.md
   */
  BillingCoreHandle,
  BillingInfo,
  CartTimer,
  Checkout,
  /**
   * @deprecated Use hooks like usePaymentData(), useEventConditions(), etc. imported directly from 'tf-checkout-react-native'. See core/MIGRATION.md
   */
  CheckoutCore,
  CheckoutCoreHandle,
  /**
   * @deprecated Use hooks like usePaymentData(), useEventConditions(), etc. imported directly from 'tf-checkout-react-native'. See core/MIGRATION.md
   */
  CheckoutForm,
  CheckoutProvider,
  CheckoutStyles,
  CheckoutTexts,
  CheckoutV2,
  deleteAllData,
  deleteUserData,
  Dropdown,
  DropdownMaterial,
  IAccountOrdersPurchasedEvent,
  IAccountOrdersTicket,
  IAccountTicketsAttributes,
  IAccountTicketsData,
  IAccountTicketsResponse,
  IAddToCartResponse,
  IBookTicketsOptions,
  ICheckoutBody,
  IDropdownStyles,
  IError,
  IEvent,
  IEventResponse,
  IGetTicketsPayload,
  IGroupedTickets,
  ILoadingStyles,
  ILoginSuccessData,
  IMyOrderDetailsData,
  IMyOrderDetailsProps,
  IMyOrdersOrder,
  IMyOrdersProps,
  IPasswordProtectedEventData,
  IPromoCodeResponse,
  IPurchaseConfirmationData,
  IPurchaseConfirmationProps,
  IRegisterNewUserBody,
  IResaleTicketsProps,
  ISelectedTicket,
  ITicket,
  ITicketsProps,
  ITicketsResponseData,
  IUserProfile,
  IConfig,
  CheckoutData as ICheckoutData,
  IMyOrderDetailsTicket,
  Loading,
  LoggedIn,
  Login,
  LoginCore,
  LoginCoreHandle,
  MyOrderDetails,
  MyOrderRequestFromType,
  MyOrders,
  MyOrdersCore,
  MyOrdersCoreHandle,
  OrderDetailsCore,
  OrderDetailsCoreHandle,
  PaymentForm,
  PromoCode,
  PurchaseConfirmation,
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
  refreshAccessToken,
  ResaleTickets,
  ResetPassword,
  ResetPasswordCore,
  ResetPasswordCoreHandle,
  SessionCoreHandleType,
  SessionHandleType,
  setConfig,
  Tickets,
  TicketsCore,
  TicketsCoreHandle,
  useAddons,
  useAddToCart,
  // New checkout hooks (replacing BillingCore and CheckoutCore functionality)
  useCart,
  useCheckout,
  useCheckoutFlow,
  useCountries,
  useEventConditions,
  useEventInfo,
  usePaymentData,
  usePaymentSuccess,
  useRegisterUser,
  useStates,
  useTickets,
  useUpdateCheckout,
  useUserProfile,
  WaitingList,
  WaitingListCore,
  WaitingListCoreHandle,
};
export default NativeModules.TFCheckoutRNModule;
