// Single Page Checkout TypeScript Types

export interface IPaymentProps {
  /** Stripe publishable key for payment processing */
  stripePublishableKey?: string
  /** Stripe Connect account ID (optional) */
  stripeAccountId?: string
  /** Callback when payment succeeds */
  onPaymentSuccess?: (data: IPaymentSuccessData) => void
  /** Callback when payment fails */
  onPaymentError?: (error: IPaymentError) => void
  /** Enable address collection in payment form */
  enableAddressElement?: boolean
  /** Custom text for payment button */
  paymentButtonText?: string
}

export interface IAddonsProps {
  /** Event ID to fetch add-ons for */
  eventId?: string
  /** Pre-loaded add-on data with custom fields */
  addOnDataWithCustomFields?: IAddonData[]
  /** Callback when add-on is selected */
  onAddOnSelect?: (id: string, value: string, addon: IAddon) => void
}

export interface IAddon {
  /** Unique addon identifier */
  id: string
  /** Display name of the addon */
  name: string
  /** Description of the addon */
  description?: string
  /** Price of the addon */
  price: string | number
  /** Cost of the addon (internal) */
  cost?: string | number
  /** Currency code (e.g., 'USD', 'EUR') */
  currency?: string
  /** Image URL for the addon */
  imageUrl?: string
  /** Whether fees are included in the price */
  feeIncluded?: boolean
  /** Available variants of the addon */
  variants?: IAddonVariant[]
  /** Sort order for display */
  sortOrder?: number
  /** Ticket restrictions (which tickets this addon applies to) */
  ticketRestrictions?: string[]
}

export interface IAddonVariant {
  /** Variant identifier */
  id: string
  /** Variant name */
  name: string
  /** Variant price */
  price: string | number
  /** Whether this variant is available */
  available: boolean
}

export interface IAddonData {
  /** Addon information */
  addon: IAddon
  /** Custom fields for this addon */
  customFields?: ICustomField[]
  /** Selected quantity */
  quantity?: number
}

export interface ICustomField {
  /** Field identifier */
  id: string
  /** Field type */
  type: 'text' | 'number' | 'select' | 'checkbox'
  /** Field label */
  label: string
  /** Whether field is required */
  required: boolean
  /** Field value */
  value?: any
  /** Options for select fields */
  options?: IFieldOption[]
}

export interface IFieldOption {
  /** Option value */
  value: string
  /** Option label */
  label: string
}

export interface IPaymentSuccessData {
  /** Payment method ID */
  paymentMethodId: string
  /** Transaction ID */
  transactionId?: string
  /** Payment amount */
  amount: string | number
  /** Currency code */
  currency: string
  /** Payment status */
  status: 'succeeded' | 'processing' | 'requires_action'
  /** Additional payment data */
  metadata?: Record<string, any>
}

export interface IPaymentError {
  /** Error code */
  code?: string
  /** Error message */
  message: string
  /** Error type */
  type?: 'card_error' | 'validation_error' | 'api_error'
  /** Additional error details */
  details?: Record<string, any>
}

export interface ICheckoutUpdateData {
  /** Updated total amount */
  total: string | number
  /** Currency code */
  currency: string
  /** Updated line items */
  lineItems: ILineItem[]
  /** Tax information */
  taxes?: ITaxInfo[]
  /** Discount information */
  discounts?: IDiscountInfo[]
  /** Updated order hash */
  orderHash?: string
}

export interface ILineItem {
  /** Item identifier */
  id: string
  /** Item name */
  name: string
  /** Item description */
  description?: string
  /** Quantity */
  quantity: number
  /** Unit price */
  unitPrice: string | number
  /** Total price for this line item */
  totalPrice: string | number
  /** Item type */
  type: 'ticket' | 'addon' | 'fee' | 'tax'
}

export interface ITaxInfo {
  /** Tax identifier */
  id: string
  /** Tax name */
  name: string
  /** Tax rate (as percentage) */
  rate: number
  /** Tax amount */
  amount: string | number
}

export interface IDiscountInfo {
  /** Discount identifier */
  id: string
  /** Discount name */
  name: string
  /** Discount type */
  type: 'percentage' | 'fixed' | 'promo_code'
  /** Discount amount */
  amount: string | number
  /** Promo code used (if applicable) */
  promoCode?: string
}

export interface ISinglePageCheckoutState {
  /** Selected add-ons with quantities */
  selectedAddOns: Record<string, number>
  /** Stripe payment method */
  stripePaymentMethod: any | null
  /** Current checkout data */
  checkoutUpdateData: ICheckoutUpdateData | null
  /** Whether the order is free */
  orderIsFree: boolean
  /** Current payment error */
  paymentError: string
  /** Loading state for checkout updates */
  isUpdatingCheckout: boolean
  /** Loading state for payment processing */
  isProcessingPayment: boolean
}

export interface ICheckoutUpdateRequest {
  attributes: {
    /** Event ID */
    event_id: string
    /** Selected add-ons */
    add_ons: Record<string, number>
    /** Additional checkout data */
    [key: string]: any
  }
}

export interface IPaymentProcessRequest {
  /** Payment method ID from Stripe */
  paymentMethodId: string
  /** Order hash */
  orderHash: string
  /** Payment amount */
  amount: string | number
  /** Currency code */
  currency?: string
  /** Additional payment metadata */
  metadata?: Record<string, any>
}

export interface IAddonsApiResponse {
  /** Add-ons data */
  data: IAddonApiData[]
  /** API metadata */
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface IAddonApiData {
  /** Addon ID */
  id: string
  /** Addon type */
  type: 'addon'
  /** Addon attributes */
  attributes: {
    name: string
    description?: string
    price: string
    cost?: string
    currency: string
    image_url?: string
    fee_included: boolean
    variants?: any[]
    sort_order?: number
    ticket_restrictions?: string[]
    custom_fields?: any[]
  }
}

export interface ICheckoutUpdateResponse {
  /** Updated checkout data */
  data: {
    /** Order ID */
    id: string
    /** Order type */
    type: 'order'
    /** Order attributes */
    attributes: {
      total: string
      currency: string
      line_items: any[]
      taxes?: any[]
      discounts?: any[]
      hash: string
    }
  }
}

export interface IPaymentProcessResponse {
  /** Payment data */
  data: {
    /** Payment ID */
    id: string
    /** Payment status */
    status: string
    /** Transaction details */
    transaction: {
      id: string
      amount: string
      currency: string
    }
  }
}

// Utility types for better type inference
export type AddonSelectionHandler = (
  id: string,
  value: string,
  addon: IAddon
) => void
export type PaymentSuccessHandler = (data: IPaymentSuccessData) => void
export type PaymentErrorHandler = (error: IPaymentError) => void
export type CheckoutUpdateSuccessHandler = (data: ICheckoutUpdateData) => void
export type CheckoutUpdateErrorHandler = (error: any) => void

// Component prop types
export interface IPaymentContainerProps {
  stripePublishableKey: string
  stripeAccountId?: string
  onPaymentMethodReady: (paymentMethod: any) => void
  onError: (error: string) => void
  checkoutData: ICheckoutUpdateData | null
  isVisible: boolean
  paymentFields?: any[]
  enableTimer?: boolean
  onCountdownFinish?: () => void
  orderInfoLabel?: string
  paymentInfoLabel?: string
  displayPaymentButton?: boolean
  hidePaymentForm?: boolean
  hideFieldsBlock?: boolean
  stripePaymentProps?: {
    billingDetails?: any
    disableZipSection?: boolean
    stripeCardOptions?: {
      style?: {
        base?: any
      }
    }
  }
}

export interface ISimpleAddonsContainerProps {
  eventId: string
  addOnDataWithCustomFields?: IAddonData[]
  configs?: any
  onAddOnSelect: AddonSelectionHandler
  selectedAddOns?: Record<string, number>
  classNamePrefix?: string
  onGetAddonsPageInfoSuccess?: (res: IAddonsApiResponse) => void
  onGetAddonsPageInfoError?: (error: any) => void
  descriptionTrigger?: 'click' | 'hover' | 'always'
}

// API function types
export type FetchAddonsFunction = (
  eventId: string
) => Promise<IAddonsApiResponse>
export type UpdateCheckoutFunction = (data: ICheckoutUpdateRequest) => Promise<{
  success: boolean
  data?: ICheckoutUpdateResponse
  error?: any
}>
export type ProcessPaymentFunction = (data: IPaymentProcessRequest) => Promise<{
  success: boolean
  data?: IPaymentProcessResponse
  error?: any
}>

// Hook types for potential future custom hooks
export interface IUseSinglePageCheckoutOptions {
  eventId: string
  stripePublishableKey: string
  stripeAccountId?: string
  onPaymentSuccess?: PaymentSuccessHandler
  onPaymentError?: PaymentErrorHandler
  onCheckoutUpdateSuccess?: CheckoutUpdateSuccessHandler
  onCheckoutUpdateError?: CheckoutUpdateErrorHandler
}

export interface IUseSinglePageCheckoutReturn {
  state: ISinglePageCheckoutState
  actions: {
    selectAddon: AddonSelectionHandler
    updateCheckout: (addons: Record<string, number>) => Promise<void>
    processPayment: (paymentMethod: any) => Promise<void>
    resetState: () => void
  }
  loading: {
    isUpdatingCheckout: boolean
    isProcessingPayment: boolean
  }
  errors: {
    paymentError: string | null
    checkoutError: string | null
  }
}
