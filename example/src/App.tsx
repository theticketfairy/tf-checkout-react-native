import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import {
  Checkout,
  IMyOrderDetailsResponse,
  IOnCheckoutSuccess,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  Tickets,
  BillingInfo,
  Login,
  IUserProfile,
  setConfig,
  ITicketsResponseData,
  SkippingStatusType,
} from 'tf-checkout-react-native'
import { IOrderDetails } from '../../src/containers/checkout/types'
import { IError } from '../../src/types'

import Color from './Colors'
import CustomLoading from './components/CustomLoading'
import { ComponentEnum } from './enums'
import styles from './styles'

const GOOGLE_IMAGE = require('./google_logo.png')
const AMAZON_IMAGE = require('./amazon_logo.png')

const EVENT_ID = 5420//10690//5420//10690//10690 //12661// 10915//MANA//10690 //5420 // Replace with assigned ID

const App = () => {
  const [componentToShow, setComponentToShow] = useState<ComponentEnum>(
    ComponentEnum.Tickets
  )
  const [cartProps, setCartProps] = useState<ITicketsResponseData | undefined>(
    undefined
  )

  //#region Loadings
  const [isLoading, setIsLoading] = useState(false)
  const [skippingStatus, setSkippingStatus] = useState<SkippingStatusType>(undefined)


  const [checkoutProps, setCheckOutProps] = useState<
    IOnCheckoutSuccess | undefined
  >(undefined)

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<IMyOrderDetailsResponse>()

  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [loggedUserName, setLoggedUserName] = useState('')
  
  //#region Handlers
  const handleOnLoginDialogSuccess = (
    userProfile: IUserProfile,
    accessToken: string
  ) => {
    setLoggedUserName(userProfile.firstName)
  }
  const handleOnAddToCartSuccess = (data: ITicketsResponseData) => {
    console.log('handleOnAddToCartSuccess',data)
    setCartProps(data)
  }

  const handleOnLoginSuccess = (data: any) => {
    console.log('handleOnLoginSuccess')
  }

  const handleOnFetchUserProfileSuccess = () => {}

  const handleOnCheckoutSuccess = (data: IOnCheckoutSuccess) => {
    console.log('handleOnCheckoutSuccess', data) // here is the order ID
    setCheckOutProps(data)
  }

  const handleOnPaymentSuccess = (data: IOnCheckoutSuccess) => {
    console.log('handleOnPaymentSuccess', data)
    setIsPaymentSuccess(true)
  }

  const handleOnComplete = () => {
    setComponentToShow(ComponentEnum.Tickets)
    console.log('Exit')
  }

  const handleOnSelectOrder = (order: IMyOrderDetailsResponse) => {
    setSelectedOrderDetails(order)
  }

  const handleOnPressMyOrders = () => {
    setComponentToShow(ComponentEnum.MyOrders)
  }

  const handleOnPressLogout = () => {
    console.log('Logout')
  }

  const handleOnDismissMyOrders = () => {
    setComponentToShow(ComponentEnum.Tickets)
  }

  const handleStripeError = () => {
    setComponentToShow(ComponentEnum.Tickets)
  }

  const handleGoBackFromOrderDetails = () => {
    setComponentToShow(ComponentEnum.MyOrders)
  }
  //#endregion

  const loginEmailRef = useRef(null)
  const loginPasswordRef = useRef(null)
  const touchableOpacityRef = useRef(null)

  //#region effects
  useEffect(() => {
    setConfig({
      DOMAIN: 'https://manacommon.com',
      BRAND: 'the-ticket-fairy',// 'mana-onetree-testing-brand',
      ARE_SUB_BRANDS_INCLUDED: true,
    })
  }, [])
  useEffect(() => {
    if (cartProps) {
      console.log('cartProps', cartProps)
      setComponentToShow(ComponentEnum.BillingInfo)
    }
  }, [cartProps])

  useEffect(() => {
    if (checkoutProps) {
      setComponentToShow(ComponentEnum.Checkout)
    }
  }, [checkoutProps])

  useEffect(() => {
    if (isPaymentSuccess) {
      setTimeout(() => {
        setComponentToShow(ComponentEnum.PurchaseConfirmation)
      }, 250)
    }
  }, [isPaymentSuccess])

  useEffect(() => {
    if (selectedOrderDetails) {
      setComponentToShow(ComponentEnum.MyOrderDetails)
    }
  }, [selectedOrderDetails])
  //#endregion

  const RenderComponent = () => {
    switch (componentToShow) {
      case ComponentEnum.BillingInfo:
        return (
          <>
          <BillingInfo
          areLoadingIndicatorsEnabled={false}
          onSkippingStatusChange={(status) => {console.log('%cApp.tsx line:159 status', 'color: #00FFcc;', status);
          setSkippingStatus(status)
        }}
          loginBrandImages={{
            image1: GOOGLE_IMAGE,
            image1Style: {
              height: 50,
              width: 100,
              resizeMode: 'contain',
              tintColor: undefined
            },
            image2: AMAZON_IMAGE,
            image2Style: {
              height: 50,
              width: 100,
              resizeMode: 'contain',
              tintColor: undefined,
              marginBottom: 16
            },
          }}
          onLoadingChange={(loading) => {
            console.log('%c BILLING LOADING', 'color: #007acc;', loading);
            setIsLoading(loading)
          }}
            texts={{
              form: {
                getYourTicketsTitle: '_Get your tickets_',
                firstName: '_First name_',
                lastName: '_Last name_',
                email: '_Email_',
                phone: '_Phone_',
                confirmEmail: '_Confirm email_',
                street: '_Street_',
                city: '_City_',
                country: '_Country_',
                zipCode: '_Zip code_',
                state: '_State_',
                ticketHoldersTitle: '_Ticket holders_',
                ticketHolderItem: '_Ticket holder item_',
                isSubToTicketFairy:'_Is sub to ticket fairy_',
                holderEmail: '_Holder email_',
                holderFirstName: '_Holder first name_',
                holderLastName: '_Holder last name_',
                holderPhone: '_Holder phone_',
                isSubToBrand: '_Is sub to Brand_',
                password: '_Password_',
                confirmPassword: '_Confirm password_',
                dateOfBirth: '_Date of birth_',
                emailsAdvice: '_Emails advice_',
                choosePassword: '_Choose password_',
                fillAllRequiredFieldsAlert: '_Fill all required fields_',
                optional: '(_Optional_)',
              },
              checkoutButton: '_Checkout_',
              loginTexts:{
                loginButton:'_Login_',
                logoutButton: '_Logout_',
                line1: '_Line 1_',
                line2: '_Line 2_',
                message: '_Message_',
                
                logoutDialog: {
                  title: '_Logout?_',
                  message: '_sure to logout?_',
                  confirm: '_yes_',
                  cancel: '_cancel_',
                },
                dialog: {
                  loginButton: '_Dialog_login_',
                  message: '_Dialog message_',
                  emailLabel: '_Dialog email label_',
                  passwordLabel: '_Dialog password label_',
                  title: '_Login title_',

                },
                loggedIn:{
                  loggedAs: '_Logged in:_',
                  notYou: '_Not you?_',
                }
                
                
              }
            }}
            styles={{
              datePicker: {
                container: { marginBottom: 16 },
                button: {
                  borderColor: Color.white,
                  borderWidth: 2,
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
                  baseColor: Color.white
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
                  input: {
                    baseColor: Color.textMain,
                    input: {
                      color: Color.textMain,
                    },
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
            }}
            cartProps={cartProps!}
            onCheckoutSuccess={handleOnCheckoutSuccess}
            onLoginSuccess={handleOnLoginSuccess}
            onFetchUserProfileSuccess={handleOnFetchUserProfileSuccess}
          />
          {isLoading && skippingStatus !== 'skipping' && <CustomLoading text='Custom loading for Billing' backgroundColor='green' />}
          {skippingStatus === 'skipping' && <CustomLoading text='Skipping loading for Billing' backgroundColor='black' /> }
          </>
        )
      case ComponentEnum.Checkout:
        return (
          <>
          <Checkout
            eventId={EVENT_ID}
            checkoutData={checkoutProps!}
            onPaymentSuccess={handleOnPaymentSuccess}
            onPressExit={handleStripeError}
            areLoadingIndicatorsEnabled={false}
            onLoadingChange={(loading) => {setIsLoading(loading)}}
            styles={{
              rootStyle: {
                paddingHorizontal: 16,
              },
              missingStripeConfig: {
                exitButton: {
                  container: {
                    width: '100%',
                  },
                  button: {
                    backgroundColor: Color.primary,
                    borderRadius: 2,
                  },
                },
              },
              title: {
                color: Color.textMain,
              },
              subTitle: {
                color: Color.textMain,
              },
              freeRegistrationButton: {
                button: {
                  backgroundColor: Color.primary,
                  borderRadius: 2,
                },
              },
              orderReview: {
                item: {
                  title: {
                    color: Color.textMainOff,
                  },
                  value: {
                    color: Color.textMain,
                  },
                  container: {
                    marginBottom: 4,
                  },
                },
              },
              payment: {
                title: {
                  color: Color.textMain,
                },
                button: {
                  button: {
                    backgroundColor: Color.primary,
                  },
                },
                cardBackgroundColor: Platform.OS === 'ios' ? Color.white : Color.gray30,
              },
            }}            
            texts={{
              title: '_Get your tickets_',
              subTitle: '_subtitle_',
              orderReviewItems: {
                event: '_EVENTO_',
                ticketType: '_TICKET_TYPE_',
                numberOfTickets: '_NUMBER_OF_TICKETS_',
                price: '_PRICE_',
                total: '_TOTAL_',
              },
              providePaymentInfo: '_Provide Payment Info_',
              payButton: '_PAY_'
            }}
            />
            {isLoading && <CustomLoading text='Loading for checkout' backgroundColor='orange'/>}

            
          </>
        )
      case ComponentEnum.PurchaseConfirmation:
        return (
          <PurchaseConfirmation
            orderHash={checkoutProps!.hash}
            onComplete={handleOnComplete}
            texts={{
              title: '_Purchase Confirmation_',
              message: {
                line1: '_Thank you for your purchase!_',
                line2: '_You will receive an email confirmation shortly._',
              },
              exitButton: '_Exit_'
              
            }}
            styles={{
              rootContainer: {
                backgroundColor: Color.backgroundMain,
              },
              title: {
                color: Color.textMain,
              },
              message: {
                container: {
                  backgroundColor: Color.blueGray,
                },
                line1: {
                  fontSize: 16,
                  textAlign: 'center',
                },
                line2: {
                  fontSize: 15,
                  textAlign: 'center',
                },
              },
              exitButton: {
                button: {
                  backgroundColor: Color.primary,
                  borderRadius: 2,
                },
              },
            }}
          />
        )

      case ComponentEnum.MyOrders:
        return (
          <View style={{ flex: 1 }}>
            <MyOrders
              config={{
                areActivityIndicatorsEnabled: false,
              }}
              onLoadingChange={(loading) => setIsLoading(loading)}
              onSelectOrder={handleOnSelectOrder}
              styles={{
                eventsTitle: {
                  color: Color.textMain,
                  fontWeight: '800',
                  fontSize: 18,
                },
                eventsContainer: {
                  paddingHorizontal: 16,
                },
                eventsDropdown: {
                  button: {
                    borderColor: Color.white,
                  },
                  label: {
                    color: Color.textMain,
                  },
                  icon: {
                    tintColor: Color.textMain,
                  },
                },
                listContainer: {
                  flex: 0.8,
                },
                orderListItem: {
                  rootContainer: {
                    backgroundColor: Color.gray80,
                  },
                  orderId: {
                    color: Color.textMain,
                  },
                  orderDate: {
                    color: Color.textMain,
                  },
                  eventName: {
                    color: Color.textMain,
                  },
                  price: {
                    color: Color.textMain,
                    fontWeight: '800',
                    fontSize: 14,
                  },
                  currency: {
                    color: Color.textMain,
                  },
                  iconNext: {
                    tintColor: Color.white,
                  },
                  contentContainer: {
                    paddingLeft: 16,
                    paddingRight: 8,
                  },
                },
              }}
              texts={{
                title: '_My Orders_',
                selectEventPlaceholder: '_Selected Order Details_',
              }}
            />
            <TouchableOpacity
              onPress={handleOnDismissMyOrders}
              style={{
                backgroundColor: Color.blueGray,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>Back</Text>
            </TouchableOpacity>
            {isLoading && <CustomLoading text='Custom loading for My Orders' backgroundColor='blue'/>}
          </View>
        )

      case ComponentEnum.MyOrderDetails:
        return (
          <View style={{ flex: 1 }}>
            <MyOrderDetails
              data={selectedOrderDetails!}
              styles={{
                downloadButton: {
                  button: {
                    backgroundColor: Color.primary,
                    height: 30,
                    borderRadius: 2,
                    marginTop: 4,
                  },
                  container: {
                    height: 45,
                  },
                },
                listItem: {
                  container: {
                    paddingHorizontal: 8,
                    borderWidth: 0,
                    backgroundColor: Color.gray80,
                    marginHorizontal: 16,
                    paddingVertical: 8,
                  },
                  rowPlaceholder: {
                    color: Color.textMainOff,
                    marginVertical: 2,
                  },
                  rowValue: {
                    color: Color.textMain,
                    marginVertical: 2,
                    fontWeight: '600',
                  },
                },
                ticketItem: {
                  container: {
                    paddingHorizontal: 8,
                    borderWidth: 0,
                    backgroundColor: Color.gray80,
                    marginHorizontal: 16,
                    paddingVertical: 8,
                  },
                  rowPlaceholder: {
                    color: Color.textMainOff,
                    marginVertical: 2,
                  },
                  rowValue: {
                    color: Color.textMain,
                    marginVertical: 2,
                    fontWeight: '600',
                  },
                },
                sectionHeader: {
                  color: Color.textMain,
                  fontSize: 16,
                  fontWeight: '700',
                  marginLeft: 16,
                },
                section0Footer: {
                  container: {
                    marginBottom: 16,
                    marginHorizontal: 16,
                  },
                  label: {
                    color: Color.textMain,
                  },
                  value: {
                    color: Color.textMain,
                    fontWeight: '700',
                    fontSize: 16,
                  },
                },
                header: {
                  container: {
                    paddingHorizontal: 16,
                    marginVertical: 16,
                  },
                  title: {
                    color: Color.textMain,
                    marginBottom: 16,
                    fontSize: 18,
                    fontWeight: '700',
                  },
                  subTitle: {
                    color: Color.textMain,
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8,
                  },
                  shareLink: {
                    message: {
                      color: Color.textMain,
                    },
                    link: {
                      color: Color.notificationPrimary,
                    },
                    copyIconTint: Color.textMain,
                    copyText: {
                      color: Color.textMain,
                    },
                    copyContainer: {
                      borderColor: Color.textMain,
                    },
                    referrals: {
                      color: Color.textMain,
                    },
                    referralValue: {
                      fontWeight: '700',
                    },
                  },
                },
              }}
              texts={{
                title: '_MY ORDERS DETAILS_',
                subTitle: '_Sub title_',
                referralLink: '_Referral_',
                listItem: {
                  title: '_Item_List_Title_',
                  price: '_Price_',
                  ticketType: '_Ticket_Type_',
                  quantity: '_Quantity_',
                  total: '_Total_',
                },
                ticketItem: {
                  title: '_Ticket_List_Title_',
                  ticketId: '_Ticket_Id_',
                  ticketType: '_Ticket_Type_',
                  ticketHolder: '_Ticket_Holder_',
                  status: '_Status_',
                  download: '_Download_',
                },
                copyText: {
                  copy: '_Copy_',
                  copied: '_Copied_',
                },
                referral: {
                  soFar: '_SO FAR_',
                  tickets: '_TICKETS_'
                }

              }}
            />
            <TouchableOpacity
              onPress={handleGoBackFromOrderDetails}
              style={{
                backgroundColor: Color.blueGray,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
        )

      default:
        return (
          <View style={{ flex: 1 }}>
            <Tickets
              areLoadingIndicatorsEnabled={false}
              eventId={EVENT_ID}
              onLoadingChange={(loading) => setIsLoading(loading)}

              onFetchTicketsSuccess={(tickets) => {console.log('onFetchTicketsSuccess', tickets)}}
              onFetchTicketsError={(error) => {console.log('onFetchTicketsError', error)}}

              onAddToCartSuccess={handleOnAddToCartSuccess}
              onAddToCartError={(error)=> {console.log('onAddToCartError', error)}}

              onFetchEventError={(error)=> {console.log('onFetchEventError', error)}}
              onFetchEventSuccess={(event)=> {console.log('onFetchEventSuccess', event)}}

              onPressLogout={handleOnPressLogout}

              onPressMyOrders={handleOnPressMyOrders}
              styles={{
                waitingList: {
                  title: { color: Color.textMain },
                  input: {
                    color: Color.textMain,
                    input: {color: Color.textMain}
                  },
                  button: {
                    button: {
                      backgroundColor: 'green'
                    }
                  },
                  buttonDisabled: {
                    button: {
                      backgroundColor: 'gray'
                    }
                  }
                }
                ,
                container: {
                  backgroundColor: Color.backgroundMain,
                  padding: 16,
                },

                title: {
                  color: Color.textMain,
                },

                getTicketsButtonActive: {
                  button: {
                    backgroundColor: Color.primary,
                    borderRadius: 2,
                  },
                  text: {
                    color: Color.white,
                  }
                },
                loggedIn: {
                  rootContainer: {
                    marginTop: 64,
                  },
                  myOrdersButton: {
                    button: {
                      backgroundColor: Color.notificationSuccess,
                      borderRadius: 2,
                    },
                  },
                  logOutButton: {
                    button: {
                      backgroundColor: Color.danger,
                      borderRadius: 2,
                    },
                  },
                },
                promoCode: {
                  content: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  },
                  inputPlaceholderColor: Color.textMain,

                 
                  input: {
                    borderColor: Color.textMainOff,
                    color: Color.white,
                  },
                  applyButton: {
                    button: {
                      backgroundColor: Color.primary,
                      borderRadius: 2,
                      height: 45,
                      paddingHorizontal: 8
                    },
                    text: {
                      fontWeight: '800',
                    },
                  },
                  applyDisabledButton: {
                    button: {
                      height: 45,
                      borderRadius: 2,
                      paddingHorizontal: 8
                    },
                    text: {
                      fontWeight: '800',
                    },
                    
                  }
                },
                ticketList: {
                  item: {
                    ticketName: {
                      color: Color.textMain,
                    },
                    price: {
                      color: Color.textMain,
                    },
                    fees: {
                      color: Color.textMainOff,
                    },
                    dropdown: {
                      dialog: {
                        backgroundColor: Color.backgroundMain,
                        paddingHorizontal: 0,
                      },
                      button: {
                        borderColor: Color.white,
                        backgroundColor: Color.backgroundMain,
                      },
                      label: {
                        color: Color.textMain,
                      },
                      icon: {
                        tintColor: Color.textMain,
                      },
                      listItem: {
                        button: {
                          width: 100,
                          backgroundColor: Color.backgroundMain,
                        },
                        buttonSelected: {
                          backgroundColor: Color.white,
                        },
                        text: {
                          color: Color.textMain,
                        },
                        textSelected: {
                          color: Color.backgroundMain,
                        },
                      },
                    },
                  },
                },
              }}

              texts={{
                promoCode: {
                  promoCodeButton: '_PROMO_CODE_',
                  inputPlaceHolder: '_ENTER_PROMO_CODE_',
                  apply: '_APPLY_',
                  cancel: '_CANCEL_',
                  mainButton: '_PROMO CODE_',
                },
                getTicketsButton: '_GET_TICKETS_',
                title:'_TITLE_',
                item: {
                  ticket: '_TICKET_'
                },
                loggedInTexts:{
                  logOutButtonText: '_LOGOUT_',
                  myOrderButtonText: '_MY_ORDERS_',
                  logoutDialog: {
                    title: '_WANT TO LOGOUT_',
                    confirmButton: '_YES_',
                    cancelButton: '_NO_',
                    message: '_MESSAGE TO SHOW_'
                  }
                }
              }}
            />
            {isLoading && <CustomLoading />}
          </View>
        )
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>{RenderComponent()}</SafeAreaView>
  )
}

export default App
