export interface IPaymentPlanConfig {
  requires_deposit: boolean
  deposit: number
  interval: number
  non_refundable_type: string | null
  non_refundable_amount: number
  has_admin_fee: boolean
  admin_fee: number
  total_installments: number
  price_per_installment: number
  total: number
  stripe_setup_intent_secret: string
  saved_card: IPaymentPlanConfigCard
}

export interface IPaymentPlanConfigCard {
  last_4_digits: string | null
  stripe_payment_method_id: string | null
}

export interface IPaymentField {
  label: string
  id: string

  className?: string
  normalizer?: any
}

export interface IAddOn {
  id: string | number
  name: string
  groupName: string | null
  price: string
  cost: string
  quantity: string | number
}

export interface IOrderData {
  id: string
  product_name: string
  ticketType: string | Array<any>
  quantity: string | number
  price: string | number
  total: string | number
  currency: string
  guest_count: string | number
  pay_now: string | number
  add_ons: IAddOn[]
  cost: string | number
}
