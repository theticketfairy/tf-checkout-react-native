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
import {
  IOnCheckoutSuccess,
  SkippingStatusType,
} from './containers/billingInfo/types'
import { ITicketsProps } from './containers/tickets/types'
import { setConfig } from './helpers/Config'
import { ITicketsResponseData, IUserProfile } from './types'

LogBox.ignoreAllLogs()
// @ts-ignore
console.reportErrorsAsExceptions = false

export {
  BillingInfo,
  Checkout,
  IMyOrderDetailsResponse,
  IMyOrdersOrder,
  IOnCheckoutSuccess,
  ITicketsProps,
  ITicketsResponseData,
  IUserProfile,
  LoggedIn,
  Login,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  setConfig,
  SkippingStatusType,
  Tickets,
}

export default NativeModules.TFCheckoutRNModule
