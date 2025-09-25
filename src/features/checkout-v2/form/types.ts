import React from 'react'
import { ScrollView } from 'react-native'

import { IDropdownItem } from '../../../components/dropdown/types'
import { IOrderItem } from '../components/OrderReview'
import { AddonItem } from '../types'

export interface TicketHolderFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CheckoutFormValues {
  // Personal information
  firstName: string
  lastName: string
  email: string
  emailConfirmation: string
  phone: string
  dateOfBirth?: Date

  // Address information
  street: string
  city: string
  postalCode: string
  country: string
  state: string

  // Authentication
  password: string
  passwordConfirmation: string

  // Marketing preferences
  isSubToTicketFairy: boolean
  isSubToBrand: boolean

  // Payment form state (internal to form)
  isCardFormComplete: boolean

  // Add-ons
  addons: Record<string, number>
  acceptedConditions: Record<string, boolean>

  // Ticket holders information
  ticketHolders: TicketHolderFormValues[]
}

export interface CheckoutFormProps {
  // Form values & state
  initialValues: CheckoutFormValues
  eventCurrency?: string
  isSubmitting: boolean
  isSinglePageCheckout?: boolean // Whether to show payment form
  // User state
  isLoggedIn: boolean
  isInitialLoading: boolean
  // Validation props
  isAgeRequired?: boolean
  minimumAge?: number
  isTicketFree?: boolean
  isPhoneRequired?: boolean
  isPhoneHidden?: boolean

  // Country & State data
  countries: Array<{ id: string; name: string }>
  states: Array<{ label: string; value: number }>
  onCountryChange: (countryId: string, item: IDropdownItem) => void

  // Order data
  orderItems: IOrderItem[]

  // Add-ons data
  availableAddons?: AddonItem[]
  onAddonChange?: (addonId: string, quantity: number) => void

  // Conditions
  conditions?: Array<{
    id: string
    name: string
    content: string
    is_required: boolean
  }>

  // Form handlers
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>

  scrollRef: React.RefObject<ScrollView | null>
}

export interface PaymentFormProps {
  // Order data
  orderItems: IOrderItem[]
  // Form handlers
  onSubmit: () => void | Promise<void>
  scrollRef: React.RefObject<ScrollView | null>
}
