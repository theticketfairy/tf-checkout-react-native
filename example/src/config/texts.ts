import { CheckoutTexts } from "tf-checkout-react-native";

export const checkoutTexts: CheckoutTexts = {
  form: {
    form: {
      sectionTitle: '_ATTENDEE_INFORMATION_',
      firstName: '_PRIMARY_ATTENDEE_FIRST_NAME_',
      firstNamePlaceholder: '_PRIMARY_ATTENDEE_FIRST_NAME_PLACEHOLDER_',
      lastName: '_PRIMARY_ATTENDEE_LAST_NAME_',
      lastNamePlaceholder: '_PRIMARY_ATTENDEE_LAST_NAME_PLACEHOLDER_',
      email: '_EMAIL_ADDRESS_',
      emailPlaceholder: '_EMAIL_ADDRESS_PLACEHOLDER_',
      emailConfirmation: '_CONFIRM_EMAIL_ADDRESS_',
      emailConfirmationPlaceholder: '_RE_ENTER_EMAIL_ADDRESS_',
      phone: '_MOBILE_NUMBER_',
      phonePlaceholder: '_INCLUDE_COUNTRY_CODE_IF_APPLICABLE_',
      state: '_STATE_',
      statePlaceholder: '_STATE_PLACEHOLDER_',
      street: '_STREET_',
      streetPlaceholder: '_STREET_PLACEHOLDER_',
      country: '_COUNTRY_',
      countryPlaceholder: '_COUNTRY_PLACEHOLDER_',
      city: '_CITY_',
      cityPlaceholder: '_CITY_PLACEHOLDER_',
      postalCode: '_POSTAL_CODE_',
      postalCodePlaceholder: '_POSTAL_CODE_PLACEHOLDER_',
      customFields: {
        dietary_requirements: {
          label: '_DIETARY_REQUIREMENTS_',
          placeholder: '_LET_US_KNOW_ABOUT_ALLERGIES_OR_PREFERENCES_',
        },
      },
    },
    ticketHolders: {
        title: '_TICKET_HOLDER_DETAILS_',
        itemTitle: '_TICKET_HOLDER_{index}_',
        firstName: '_FIRST_NAME_',
        firstNamePlaceholder: '_ENTER_TICKET_HOLDER_FIRST_NAME_',
        lastName: '_LAST_NAME_',
        lastNamePlaceholder: '_ENTER_TICKET_HOLDER_LAST_NAME_',
        email: '_EMAIL_',
        emailPlaceholder: '_ENTER_TICKET_HOLDER_EMAIL_',
        phone: '_PHONE_',
        phonePlaceholder: '_ENTER_TICKET_HOLDER_PHONE_',
        customFields: {
          tshirt_size: {
            label: '_TSHIRT_SIZE_',
            placeholder: '_SELECT_THE_PREFERRED_SIZE_',
          },
        },
      },
      marketingOptIns: {
        ticketFairyOptIn: '_KEEP_ME_UPDATED_ABOUT_TICKET_FAIRY_NEWS_',
        organizerOptIn: '_SEND_ME_UPDATES_FROM_THE_EVENT_ORGANISER_',
      },
      addons: {
        title: '_ENHANCE_YOUR_EXPERIENCE_',
        quantityLabel: '_QTY_',
        priceWithFeesSuffix: '_PRICE_WITH_FEES_SUFFIX_',
      },
      orderSummary: {
        sectionTitle: '_REVIEW_YOUR_ORDER_',
      },
      payment: {
        sectionTitle: '_SECURE_PAYMENT_',
        errorRequired: '_PLEASE_COMPLETE_YOUR_CARD_DETAILS_TO_CONTINUE_',
      },
      buttons: {
        singlePageSubmit: '_PLACE_ORDER_',
        goToPayment: '_CONTINUE_TO_PAYMENT_',
        paymentSubmit: '_PAY_NOW_',
      },
      conditions: {
        title: '_EVENT_TERMS_AND_CONDITIONS_',
        acceptLabel: '_I_AGREE_TO_THE_TERMS_ABOVE_',
        viewButton: '_VIEW_TERMS_',
        hideButton: '_HIDE_TERMS_',
      },
      
  },
  login: {
    loginButton: '_LOGIN_',
      logoutButton: '_LOGOUT_',
      line1: '_LINE_1_',
      line2: '_LINE_2_',
      message: '_MESSAGE_',
      dialog: {
        loginButton: '_LOGIN_BUTTON_',
        message: '_MESSAGE_',
        emailLabel: '_EMAIL_LABEL_',
        passwordLabel: '_PASSWORD_LABEL_',
        title: '_TITLE_',
        forgotPassword: '_FORGOT_PASSWORD_',
      },
      logoutDialog: {
        title: '_TITLE_',
        message: '_MESSAGE_',
        confirm: '_CONFIRM_',
        cancel: '_CANCEL_',
      },
      loggedIn: {
        loggedAs: '_LOGGED_AS_',
        notYou: '_NOT_YOU_',
      },
      restorePassword: {
        restorePasswordButton: '_RESTORE_PASSWORD_BUTTON_',
        cancelButton: '_CANCEL_BUTTON_',
        message: '_MESSAGE_',
        inputLabel: '_INPUT_LABEL_',
        title: '_TITLE_',
      },
      restorePasswordSuccess: {
        title: '_TITLE_',
        message: '_MESSAGE_',
        button: '_BUTTON_',
      },
  },
  cartTimer: {
    message: '_MESSAGE_',
  },
}
