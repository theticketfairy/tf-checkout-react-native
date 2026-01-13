import { CheckoutFormTexts } from './types';

export const defaultCheckoutFormTexts: Required<CheckoutFormTexts> = {
  form: {
    sectionTitle: 'Personal Information',
    firstName: 'First Name',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Enter your last name',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    emailConfirmation: 'Confirm Email',
    emailConfirmationPlaceholder: 'Confirm your email',
    password: 'Password',
    passwordPlaceholder: 'Enter a password',
    passwordConfirmation: 'Confirm Password',
    passwordConfirmationPlaceholder: 'Confirm your password',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',
    dateOfBirth: 'Date of Birth',
    dateOfBirthPlaceholder: 'Date of Birth',
    street: 'Street Address',
    streetPlaceholder: 'Enter your street address',
    city: 'City',
    cityPlaceholder: 'Enter your city',
    country: 'Country',
    countryPlaceholder: 'Select your country',
    state: 'State',
    statePlaceholder: 'Select your state',
    postalCode: 'Postal Code',
    postalCodePlaceholder: 'Enter your postal code',
    customFields: {},
  },
  ticketHolders: {
    title: 'Ticket Holders',
    itemTitle: 'Ticket {index}',
    firstName: 'First Name *',
    firstNamePlaceholder: 'Enter first name',
    lastName: 'Last Name *',
    lastNamePlaceholder: 'Enter last name',
    email: 'Email',
    emailPlaceholder: 'Enter email address',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    customFields: {},
  },
  marketingOptIns: {
    ticketFairyOptIn: 'Subscribe to The Ticket Fairy newsletters',
    organizerOptIn: 'Subscribe to event organizer newsletters',
  },
  addons: {
    title: 'Available Add-ons',
    quantityLabel: 'Qty',
    priceWithFeesSuffix: ' (with fees)',
  },
  orderSummary: {
    sectionTitle: 'Order Summary',
  },
  payment: {
    sectionTitle: 'Payment Details',
    errorRequired: 'Please fill your payment information',
  },
  buttons: {
    singlePageSubmit: 'Complete Checkout',
    goToPayment: 'Proceed to Payment',
    paymentSubmit: 'Complete Payment',
  },
  conditions: {
    title: 'Event Conditions',
    acceptLabel: 'I have read and accept these conditions',
    viewButton: 'View',
    hideButton: 'Hide',
  },
};

const mergeCustomFieldMap = (
  base: Record<string, { label?: string; placeholder?: string }>,
  override?: Record<string, { label?: string; placeholder?: string }>
): Record<string, { label?: string; placeholder?: string }> => ({
  ...base,
  ...(override ?? {}),
});

export const mergeCheckoutFormTexts = (
  overrides?: CheckoutFormTexts
): Required<CheckoutFormTexts> => {
  if (!overrides) {
    return defaultCheckoutFormTexts;
  }

  return {
    form: {
      ...defaultCheckoutFormTexts.form,
      ...overrides.form,
      customFields: mergeCustomFieldMap(
        defaultCheckoutFormTexts.form.customFields || {},
        overrides.form?.customFields
      ),
    },
    ticketHolders: {
      ...defaultCheckoutFormTexts.ticketHolders,
      ...overrides.ticketHolders,
      customFields: mergeCustomFieldMap(
        defaultCheckoutFormTexts.ticketHolders.customFields || {},
        overrides.ticketHolders?.customFields
      ),
    },
    marketingOptIns: {
      ...defaultCheckoutFormTexts.marketingOptIns,
      ...overrides.marketingOptIns,
    },
    addons: {
      ...defaultCheckoutFormTexts.addons,
      ...overrides.addons,
    },
    orderSummary: {
      ...defaultCheckoutFormTexts.orderSummary,
      ...overrides.orderSummary,
    },
    payment: {
      ...defaultCheckoutFormTexts.payment,
      ...overrides.payment,
    },
    buttons: {
      ...defaultCheckoutFormTexts.buttons,
      ...overrides.buttons,
    },
    conditions: {
      ...defaultCheckoutFormTexts.conditions,
      ...overrides.conditions,
    },
  };
};
