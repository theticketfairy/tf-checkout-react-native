// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react' //Needed to render
import { LogBox, NativeModules } from 'react-native'

import {
  BillingInfo,
  Checkout,
  MyOrderDetails,
  PurchaseConfirmation,
  Tickets,
} from './containers'
import { IOnCheckoutSuccess } from './containers/billingInfo/types'
import { IAddToCartSuccess, ITicketsProps } from './containers/tickets/types'

LogBox.ignoreAllLogs()

export {
  BillingInfo,
  Checkout,
  IAddToCartSuccess,
  IOnCheckoutSuccess,
  ITicketsProps,
  MyOrderDetails,
  PurchaseConfirmation,
  Tickets,
}

export default NativeModules.TFCheckoutRNModule
