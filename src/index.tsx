//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import type {
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
import type {
  IBillingProps,
  IOnCheckoutSuccess,
  SkippingStatusType,
} from './containers/billingInfo/types'
import type { ICheckoutProps } from './containers/checkout/types'
import type { IMyOrderDetailsProps } from './containers/myOrderDetails/types'
import type { IMyOrdersProps } from './containers/myOrders/types'
import type { IPurchaseConfirmationProps } from './containers/purchaseConfirmation/types'
import type { IResaleTicketsProps } from './containers/resaleTickets/types'
import type { ITicketsProps } from './containers/tickets/types'
import {
  BillingCore,
  type BillingCoreHandle,
  CheckoutCore,
  type CheckoutCoreHandle,
  LoginCore,
  type LoginCoreHandle,
  MyOrdersCore,
  type MyOrdersCoreHandle,
  OrderDetailsCore,
  type OrderDetailsCoreHandle,
  PurchaseConfirmationCore,
  type PurchaseConfirmationCoreHandle,
  ResetPasswordCore,
  type ResetPasswordCoreHandle,
  type SessionCoreHandleType,
  type SessionHandleType,
  TicketsCore,
  type TicketsCoreHandle,
  WaitingListCore,
  type WaitingListCoreHandle,
} from './core'
import { setConfig } from './helpers/Config'
import { deleteAllData } from './helpers/LocalStorage'
import { refreshAccessToken } from './helpers/RefreshAccessToken'
import type {
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
  BillingInfo,
  Checkout,
  CheckoutCore, 
  deleteAllData, 
  LoggedIn,
  Login,
  LoginCore, 
  MyOrderDetails, MyOrders,
  MyOrdersCore, OrderDetailsCore, PurchaseConfirmation,
  PurchaseConfirmationCore, refreshAccessToken,
  ResaleTickets,
  ResetPassword,
  ResetPasswordCore, setConfig, Tickets,
  TicketsCore, WaitingListCore
}
export type {
  BillingCoreHandle, CheckoutCoreHandle, IAccountOrdersPurchasedEvent,
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
  IUserProfile, LoginCoreHandle, MyOrderRequestFromType, MyOrdersCoreHandle, OrderDetailsCoreHandle, PurchaseConfirmationCoreHandle, ResetPasswordCoreHandle,
  SessionCoreHandleType,
  SessionHandleType, SkippingStatusType, TicketsCoreHandle, WaitingListCoreHandle
}

export default NativeModules.TFCheckoutRNModule
