import { StyleSheet } from 'react-native'
import Color from './Colors'
import type { IBillingInfoViewStyles } from 'src/containers/billingInfo/types'

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.backgroundMain,
  },
})

export const billingInfoStyles: IBillingInfoViewStyles = {
  cartTimer: {
    message: {
      color: Color.black
    },
    time: {
      color: Color.black
    },
  },
  datePicker: {
    container: { marginBottom: 16 },
    button: {
      borderColor: Color.white,
      borderWidth: 1,
    },
    text: {
      color: Color.textMain,
      fontSize: 16,
    },
    error: {
      color: Color.danger,
      fontSize: 14,
      marginTop: 4,
    },
    errorColor: Color.danger,
  },
  rootContainer: {
    marginHorizontal: 24,
    marginBottom: 50,
  },
  customCheckbox: {
    text: {
      flex: 1,
      color: Color.textMain,
    },
    container: {
      width: '100%',
    },
    errorColor: Color.danger,
  },
  privacyPolicyLinkStyle: {
    color: Color.influencerCooler
  },
  passwordTitle: {
    color: Color.textMain,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  checkboxStyles: {
    container: {
      width: '100%',
    },
    text: {
      color: Color.textMain,
    },
    indicator: {
      borderColor: Color.white,
      backgroundColor: Color.white,
    },
    indicatorDisabled: {
      borderColor: Color.white,
    },
    icon: {
      tintColor: Color.validationGreen,
    },
    error: {
      color: Color.danger,
      marginTop: 8,
      marginLeft: 40,
    },
    errorColor: Color.danger
  },
  checkoutButton: {
    button: {
      backgroundColor: Color.primary,
      borderRadius: 2,
    },
  },
  checkoutButtonDisabled: {
    button: {
      backgroundColor: Color.blueGray,
      borderRadius: 2,
    },
  },
  texts: {
    color: Color.textMain,
    fontSize: 14,
    marginBottom: 16,
  },
  dropdownStyles: {
    container: {
      width: '100%',
      marginBottom: 32,
    },
    button: {
      borderColor: Color.white,
      width: '100%',
      height: 50,
      borderRadius: 5,
      borderWidth: 1,
    },
    label: {
      color: Color.textMain,
      fontSize: 16,
    },
    icon: {
      tintColor: Color.white,
    },
  },
  dropdownMaterialStyles: {
    input: {
      baseColor: Color.white,
      errorColor: Color.danger    
    },
  },
  ticketHolderItemHeader: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: Color.textMain,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: Color.textMain,
  },
  ticketHoldersTitle: {
    color: Color.textMain,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputStyles: {
    input: {
      color: Color.textMain,
    },
    container: {
      borderColor: 'red',
    },
    baseColor: Color.white,
    errorColor: Color.danger,
  },
  loginStyles: {
    guest: {
      line1: {
        color: Color.textMain,
      },
      line2: {
        color: Color.textMain,
      },
      loginButton: {
        button: {
          backgroundColor: Color.primary,
          borderRadius: 2,
        },
      },
    },
    dialog: {
      container: {
        backgroundColor: Color.backgroundMain,
      },
      title: {
        color: Color.textMain,
      },
      message: { 
        color: Color.textMain
      },
      input: {
        color: Color.textMain,
        baseColor: Color.textMain,
        input: {
          color: Color.textMain
        }
      },
      forgotPassword: {
        color: Color.textMain
      },
      loginButton: {
        button: {
          backgroundColor: Color.primary,
          borderRadius: 2,
        },
      },
      loginButtonDisabled: {
        button: {
          backgroundColor: Color.blueGray,
          borderRadius: 2,
        },
        container: {
          width: '100%',
        },
      },
    },
    loggedIn: {
      placeholder: {
        color: Color.textMain,
        fontSize: 16,
      },
      value: {
        fontWeight: '800',
      },
      message: {
        color: Color.textMain,
      },
      button: {
        button: {
          backgroundColor: Color.danger,
          borderRadius: 2,
        },
      },
    },
  },
  phoneInput: {
    input: {
      baseColor: Color.textMain,
      color: Color.textMain,
      errorColor: Color.danger,
      
    },
    
  },
}
