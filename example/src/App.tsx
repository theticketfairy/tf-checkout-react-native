import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
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
} from 'tf-checkout-react-native'

import Color from './Colors'
import { ComponentEnum } from './enums'
import styles from './styles'

const EVENT_ID =  10915//MANA//10690 //5420 // Replace with assigned ID

const App = () => {
  const [componentToShow, setComponentToShow] = useState<ComponentEnum>(
    ComponentEnum.Tickets
  )
  const [cartProps, setCartProps] = useState<ITicketsResponseData | undefined>(
    undefined
  )
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
    console.log('handleOnCheckoutSuccess', handleOnCheckoutSuccess)
    setCheckOutProps(data)
  }

  const handleOnPaymentSuccess = (data: any) => {
    console.log('handleOnPaymentSuccess')
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
      DOMAIN: 'https://tickets.manacommon.com',
      BRAND: 'mana-onetree-testing-brand',
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
          <BillingInfo
            privacyPolicyLinkStyle={{
              color: Color.primary,
            }}
            texts={{
              form: {
                checkbox: 'This is an injected text for your brand',
              },
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
        )
      case ComponentEnum.Checkout:
        return (
          <Checkout
            eventId={EVENT_ID}
            hash={checkoutProps!.hash}
            total={checkoutProps!.total}
            onPaymentSuccess={handleOnPaymentSuccess}
            onPressExit={handleStripeError}
            areLoadingIndicatorsEnabled={false}
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
              },
            }}
          />
        )
      case ComponentEnum.PurchaseConfirmation:
        return (
          <PurchaseConfirmation
            orderHash={checkoutProps!.hash}
            onComplete={handleOnComplete}
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
              eventId={EVENT_ID}
              onLoadingChange={(isLoading) => {console.log('is tickets loading', isLoading)}}

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
                  inputPlaceholderColor: Color.textMain,
                  input: {
                    borderColor: Color.textMainOff,
                    color: Color.white,
                  },
                  title: {
                    color: Color.textMain,
                    fontSize: 18,
                  },
                  cancelButton: {
                    text: {
                      color: Color.textMain,
                    },
                    button: {
                      borderRadius: 2,
                    },
                  },
                  applyButton: {
                    button: {
                      backgroundColor: Color.primary,
                      borderRadius: 2,
                    },
                    text: {
                      fontWeight: '800',
                    },
                  },
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
            />
          </View>
        )
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>{RenderComponent()}</SafeAreaView>
  )
}

export default App
