// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import {
  IMyOrderDetailsResponse,
  IMyOrderDetailsTicket,
  IMyOrdersOrder,
} from './api/types'
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
import { IOnCheckoutSuccess } from './containers/billingInfo/types'
import { IAddToCartSuccess, ITicketsProps } from './containers/tickets/types'
import { setConfig } from './helpers/Config'
import { IUserProfile } from './types'

LogBox.ignoreAllLogs()
// @ts-ignore
console.reportErrorsAsExceptions = false

export {
  BillingInfo,
  Checkout,
  IAddToCartSuccess,
  IMyOrderDetailsResponse,
  IMyOrderDetailsTicket,
  IMyOrdersOrder,
  IOnCheckoutSuccess,
  ITicketsProps,
  IUserProfile,
  LoggedIn,
  Login,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  ResaleTickets,
  setConfig,
  Tickets,
}

export default NativeModules.TFCheckoutRNModule
