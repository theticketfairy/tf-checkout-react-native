// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import {
  ICheckoutBody,
  IEventResponse,
  IMyOrderDetailsData,
  IMyOrdersOrder,
  IPromoCodeResponse,
  IRegisterNewUserBody,
  MyOrderRequestFromType,
} from './api/types'
import {
  Dropdown,
  DropdownMaterial,
  LoggedIn,
  Login,
  PromoCode,
  WaitingList,
} from './components'
import { ILoginSuccessData } from './components/login/types'
import {
  BillingInfo,
  Checkout,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  ResaleTickets,
  ResetPassword,
  Tickets,
} from './containers'
import {
  IBillingProps,
  IOnCheckoutSuccess,
  SkippingStatusType,
} from './containers/billingInfo/types'
import { ICheckoutProps } from './containers/checkout/types'
import { IMyOrderDetailsProps } from './containers/myOrderDetails/types'
import { IMyOrdersProps } from './containers/myOrders/types'
import { IPurchaseConfirmationProps } from './containers/purchaseConfirmation/types'
import { IResaleTicketsProps } from './containers/resaleTickets/types'
import {
  IPasswordProtectedEventData,
  ITicketsProps,
} from './containers/tickets/types'
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
} from './core'
import {
  IBookTicketsOptions,
  IGetTicketsPayload,
  IGroupedTickets,
} from './core/TicketsCore/TicketsCoreTypes'
import { setConfig } from './helpers/Config'
import { deleteAllData, deleteUserData } from './helpers/LocalStorage'
import { refreshAccessToken } from './helpers/RefreshAccessToken'
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
} from './types'

LogBox.ignoreAllLogs()
// @ts-ignore
console.reportErrorsAsExceptions = false

export {
  BillingCore,
  BillingCoreHandle,
  BillingInfo,
  Checkout,
  CheckoutCore,
  CheckoutCoreHandle,
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
  IBillingProps,
  IBookTicketsOptions,
  ICheckoutBody,
  ICheckoutProps,
  IError,
  IEvent,
  IEventResponse,
  IGetTicketsPayload,
  IGroupedTickets,
  ILoginSuccessData,
  IMyOrderDetailsData,
  IMyOrderDetailsProps,
  IMyOrdersOrder,
  IMyOrdersProps,
  IOnCheckoutSuccess,
  IPasswordProtectedEventData,
  IPromoCodeResponse,
  IPurchaseConfirmationProps,
  IRegisterNewUserBody,
  IResaleTicketsProps,
  ISelectedTicket,
  ITicket,
  ITicketsProps,
  ITicketsResponseData,
  IUserProfile,
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
  SkippingStatusType,
  Tickets,
  TicketsCore,
  TicketsCoreHandle,
  WaitingList,
  WaitingListCore,
  WaitingListCoreHandle,
}

export default NativeModules.TFCheckoutRNModule
