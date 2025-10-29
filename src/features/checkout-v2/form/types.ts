import React, { JSX } from 'react';
import type {
  ScrollViewScrollToOptions,
  ScrollView as ScrollViewType,
} from 'react-native'; // 👈 grab the instance type

import { CustomField } from '../../event/types';
import { IOrderItem } from '../components/OrderReview';
import { AddonItem, UpdateCheckoutResponse } from '../types';
import { CheckoutFormStyles } from './styles';

export interface TicketHolderFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customFields?: Record<string, string | string[]>;
}

export interface CheckoutFormValues {
  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmation: string;
  phone: string;
  dateOfBirth?: string;

  // Address information
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;

  // Authentication
  password: string;
  passwordConfirmation: string;

  // Marketing preferences
  isSubToTicketFairy: boolean;
  isSubToBrand: boolean;

  // Payment form state (internal to form)
  isCardFormComplete: boolean;

  // Add-ons
  addons: {
    [addonId: string]: {
      quantity: number;
      customFields: Record<string, string>;
    };
  };
  acceptedConditions: Record<string, boolean>;

  // Custom fields
  customFields: Record<string, string | string[]>;

  // Ticket holders information
  ticketHolders: TicketHolderFormValues[];
}

export interface CheckoutFormProps {
  // Form values & state
  initialValues: CheckoutFormValues;
  eventCurrency?: string;
  isSubmitting: boolean;
  isSinglePageCheckout?: boolean; // Whether to show payment form
  // User state
  isLoggedIn: boolean;
  isInitialLoading: boolean;
  // Validation props
  isAgeRequired?: boolean;
  minimumAge?: number;
  isTicketFree?: boolean;
  isPhoneRequired?: boolean;
  isPhoneHidden?: boolean;

  // Country & State data
  countries: Array<{ id: string; name: string }>;
  states: Array<{ label: string; value: string }>;
  onCountryChange: (countryId: string) => void;

  // Order data
  orderItems: IOrderItem[];
  orderCustomFields?: CustomField[];

  // Ticket data
  ticketCustomFields?: CustomField[];

  // Add-ons data
  availableAddons?: AddonItem[];
  addonCustomFields?: CustomField[];
  onAddonChange?: (addonId: string, quantity: number) => void;

  // Conditions
  conditions?: Array<{
    id: string;
    name: string;
    content: string;
    is_required: boolean;
  }>;

  // Form handlers
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;

  scrollRef: React.RefObject<{
    scrollTo: (options: ScrollViewScrollToOptions) => void;
  } | null>;
  styles?: CheckoutFormStyles;
  texts?: CheckoutFormTexts;
}

export interface CheckoutFormTexts {
  form?: CheckoutFormFormTexts;
  ticketHolders?: CheckoutFormTicketHolderTexts;
  marketingOptIns?: CheckoutFormMarketingTexts;
  addons?: CheckoutFormAddonTexts;
  orderSummary?: CheckoutFormOrderSummaryTexts;
  payment?: CheckoutFormPaymentTexts;
  buttons?: CheckoutFormButtonTexts;
  conditions?: CheckoutFormConditionsTexts;
}

export interface CheckoutFormFormTexts {
  sectionTitle?: string;
  firstName?: string;
  firstNamePlaceholder?: string;
  lastName?: string;
  lastNamePlaceholder?: string;
  email?: string;
  emailPlaceholder?: string;
  emailConfirmation?: string;
  emailConfirmationPlaceholder?: string;
  password?: string;
  passwordPlaceholder?: string;
  passwordConfirmation?: string;
  passwordConfirmationPlaceholder?: string;
  phone?: string;
  phonePlaceholder?: string;
  dateOfBirth?: string;
  dateOfBirthPlaceholder?: string;
  street?: string;
  streetPlaceholder?: string;
  city?: string;
  cityPlaceholder?: string;
  country?: string;
  countryPlaceholder?: string;
  state?: string;
  statePlaceholder?: string;
  postalCode?: string;
  postalCodePlaceholder?: string;
  customFields?: Record<string, { label?: string; placeholder?: string }>;
}

export interface CheckoutFormTicketHolderTexts {
  title?: string;
  itemTitle?: string;
  firstName?: string;
  firstNamePlaceholder?: string;
  lastName?: string;
  lastNamePlaceholder?: string;
  email?: string;
  emailPlaceholder?: string;
  phone?: string;
  phonePlaceholder?: string;
  customFields?: Record<string, { label?: string; placeholder?: string }>;
}

export interface CheckoutFormMarketingTexts {
  ticketFairyOptIn?: string;
  organizerOptIn?: string;
}

export interface CheckoutFormAddonTexts {
  title?: string;
  quantityLabel?: string;
  priceWithFeesSuffix?: string;
}

export interface CheckoutFormOrderSummaryTexts {
  sectionTitle?: string;
}

export interface CheckoutFormPaymentTexts {
  sectionTitle?: string;
  errorRequired?: string;
}

export interface CheckoutFormButtonTexts {
  singlePageSubmit?: string;
  goToPayment?: string;
  paymentSubmit?: string;
}

export interface CheckoutFormConditionsTexts {
  title?: string;
  acceptLabel?: string;
  viewButton?: string;
  hideButton?: string;
}

export interface PaymentFormProps {
  // Order data
  orderItems: IOrderItem[];
  // Form handlers
  onSubmit: () => void | Promise<void>;
  scrollRef: React.RefObject<{
    scrollTo: (options: ScrollViewScrollToOptions) => void;
  } | null>;
  styles?: CheckoutFormStyles;
  texts?: CheckoutFormTexts;

  // Stripe required data
  paymentInformation?: UpdateCheckoutResponse['attributes']['additional_payment_information']
}

export interface CreateFormFieldsOptions {
  isLoggedIn: CheckoutFormProps['isLoggedIn'];
  isAgeRequired: CheckoutFormProps['isAgeRequired'];
  isPhoneHidden: CheckoutFormProps['isPhoneHidden'];
  isPhoneRequired: CheckoutFormProps['isPhoneRequired'];
  countries: CheckoutFormProps['countries'];
  states: CheckoutFormProps['states'];
  onCountryChange: CheckoutFormProps['onCountryChange'];
  orderCustomFields: CheckoutFormProps['orderCustomFields'];
  availableAddons: CheckoutFormProps['availableAddons'];
  eventCurrency: CheckoutFormProps['eventCurrency'];
  onAddonChange: CheckoutFormProps['onAddonChange'];
  ticketHoldersCount: number;
}
