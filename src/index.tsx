// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import { IMyOrderDetailsResponse, IMyOrdersOrder } from './api/types'
import { LoggedIn, Login } from './components'
import {
  BillingInfo,
  Checkout,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  Tickets,
} from './containers'
import { IOnCheckoutSuccess } from './containers/billingInfo/types'
import { IAddToCartSuccess, ITicketsProps } from './containers/tickets/types'
import { IUserProfile } from './types'

LogBox.ignoreAllLogs()
// @ts-ignore
console.reportErrorsAsExceptions = false

export {
  BillingInfo,
  Checkout,
  IAddToCartSuccess,
  IMyOrderDetailsResponse,
  IMyOrdersOrder,
  IOnCheckoutSuccess,
  ITicketsProps,
  IUserProfile,
  LoggedIn,
  Login,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  Tickets,
}

export default NativeModules.TFCheckoutRNModule
