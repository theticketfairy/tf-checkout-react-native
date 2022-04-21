// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import { IMyOrderDetailsData, IMyOrdersOrder } from './api/types'
import { LoggedIn, Login } from './components'
import {
  BillingInfo,
  Checkout,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  ResaleTickets,
  Tickets,
} from './containers'
import {
  IOnCheckoutSuccess,
  SkippingStatusType,
} from './containers/billingInfo/types'
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
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
  TicketsCore,
  TicketsCoreHandle,
  WaitingListCore,
  WaitingListCoreHandle,
} from './core'
import { setConfig } from './helpers/Config'
import { deleteAllData } from './helpers/LocalStorage'
import { ITicketsResponseData, IUserProfile } from './types'

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
  IMyOrderDetailsData,
  IMyOrdersOrder,
  IOnCheckoutSuccess,
  ITicketsProps,
  ITicketsResponseData,
  IUserProfile,
  LoggedIn,
  Login,
  LoginCore,
  LoginCoreHandle,
  MyOrderDetails,
  MyOrders,
  MyOrdersCore,
  MyOrdersCoreHandle,
  PurchaseConfirmation,
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
  ResaleTickets,
  setConfig,
  SkippingStatusType,
  Tickets,
  TicketsCore,
  TicketsCoreHandle,
  WaitingListCore,
  WaitingListCoreHandle,
}

export default NativeModules.TFCheckoutRNModule
