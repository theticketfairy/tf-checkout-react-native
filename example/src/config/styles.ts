import { CheckoutStyles } from 'tf-checkout-react-native';
import { Color } from './common';

export const checkoutStyles: CheckoutStyles = {
  container: {
    backgroundColor: Color.backgroundMain,
  },
  contentContainer: {
    paddingBottom: 48,
  },
  title: {
    color: Color.white,
  },
  login: {
    dialog: {
      title: {
        color: Color.black,
      },
      message: {
        color: Color.black,
      },
    },
    loggedIn: {
      message: {
        color: Color.black,
      },
      placeholder: {
        color: Color.black,
      },
    },
  },
  cartTimer: {
    rootContainer: {
      backgroundColor: Color.primary,
    },
    time: {
      color: Color.white,
    },
    message: {
      color: Color.white,
    },
  },
  form: {
    form: {
      backgroundColor: Color.gray80,
      borderRadius: 12,
      padding: 16,
    },
    sectionTitle: {
      color: Color.white,
    },
    button: {
      backgroundColor: Color.primary,
    },
    buttonText: {
      color: Color.white,
    },
    ticketHolderTitle: {
      color: Color.white,
    },
    addonName: {
      color: Color.white,
    },
    addonPrice: {
      color: Color.white,
    },
    addonDescription: {
      color: Color.white,
    },
    addonSubtitle: {
      color: Color.white,
    },
    addonMainTitle: {
      color: Color.white,
    },
    errorText: {
      color: Color.orange,
    },
    addonSection: {
      borderColor: Color.gray60,
      backgroundColor: Color.backgroundMain,
    },
    addonItem: {
      borderBottomColor: Color.gray70,
    },
    addonSelectContainer: {
      width: 90,
    },
    orderReviewContainer: {
      backgroundColor: Color.backgroundMain,
      borderRadius: 12,
      padding: 16,
    },
    cardContainer: {
      height: 250,
    },
    orderReviewItem: {
      container: {
        backgroundColor: Color.backgroundMain,
      },
      title: {
        color: Color.white,
      },
      subtitle: {
        color: Color.white,
      },
      value: {
        color: Color.white,
      },
    },
    fields: {
      input: {
        input: {
          color: Color.white,
        },
        baseColor: Color.white,
        color: Color.white,
        placeholderColor: Color.gray50,
        errorColor: Color.primary,
      },
      select: {
        input: {
          input: {
            color: Color.white,
          },
          baseColor: Color.white,
          color: Color.white,
          errorColor: Color.primary,
        },
        icon: {
          tintColor: Color.white,
        },
      },
      selectMulti: {
        input: {
          input: {
            color: Color.white,
          },
          baseColor: Color.white,
          color: Color.white,
          errorColor: Color.primary,
        },
        icon: {
          tintColor: Color.white,
        },
      },
      phone: {
        input: {
          input: {
            color: Color.white,
          },
          baseColor: Color.white,
          color: Color.white,
          errorColor: Color.primary,
        },
      },
      checkbox: {
        text: {
          color: Color.white,
        },
        indicator: {
          borderColor: Color.white,
        },
        indicatorDisabled: {
          borderColor: Color.gray60,
        },
      },
      radio: {
        labelText: {
          color: Color.white,
        },
        optionText: {
          color: Color.white,
        },
        radioOuter: {
          borderColor: Color.white,
        },
        radioOuterSelected: {
          borderColor: Color.primary,
        },
        radioInner: {
          backgroundColor: Color.primary,
        },
      },
      datePicker: {
        input: {
          color: Color.white,
        },
        baseColor: Color.white,
        errorColor: Color.primary,
      },
    },
  },
};
