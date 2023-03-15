// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import {
  IMyOrderDetailsData,
  IMyOrdersOrder,
  MyOrderRequestFromType,
} from './api/types'
import { LoggedIn, Login } from './components'
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
import { ITicketsProps } from './containers/tickets/types'
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
import { setConfig } from './helpers/Config'
import { deleteAllData } from './helpers/LocalStorage'
import { refreshAccessToken } from './helpers/RefreshAccessToken'
import {
  IAccountOrdersPurchasedEvent,
  IAccountOrdersTicket,
  IAccountTicketsAttributes,
  IAccountTicketsData,
  IAccountTicketsResponse,
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
  IAccountOrdersPurchasedEvent,
  IAccountOrdersTicket,
  IAccountTicketsAttributes,
  IAccountTicketsData,
  IAccountTicketsResponse,
  IBillingProps,
  ICheckoutProps,
  IMyOrderDetailsData,
  IMyOrderDetailsProps,
  IMyOrdersOrder,
  IMyOrdersProps,
  IOnCheckoutSuccess,
  IPurchaseConfirmationProps,
  IResaleTicketsProps,
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
  WaitingListCore,
  WaitingListCoreHandle,
}

export default NativeModules.TFCheckoutRNModule
