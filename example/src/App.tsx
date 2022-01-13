import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'

import {
  Tickets,
  IAddToCartSuccess,
  IOnCheckoutSuccess,
  BillingInfo,
  Checkout,
  PurchaseConfirmation,
  MyOrderDetails,
  IMyOrderDetailsResponse,
  IMyOrdersOrder,
  MyOrders,
} from 'tf-checkout-react-native'
import Color from './Colors'
import styles from './styles'

const EVENT_ID = 5420 // Replace with assigned ID
enum ComponentEnum {
  Tickets,
  BillingInfo,
  Checkout,
  PurchaseConfirmation,
  MyOrders,
  MyOrderDetails,
}

const App = () => {
  const [componentToShow, setComponentToShow] = useState<ComponentEnum>(
    ComponentEnum.Tickets
  )
  const [cartProps, setCartProps] = useState<IAddToCartSuccess | undefined>(
    undefined
  )
  const [checkoutProps, setCheckOutProps] = useState<
    IOnCheckoutSuccess | undefined
  >(undefined)

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<IMyOrderDetailsResponse>()

  //#region Handlers
  const handleOnAddToCartSuccess = (data: IAddToCartSuccess) => {
    setCartProps(data)
  }

  const handleOnLoginSuccess = (data: any) => {
    console.log('handleOnLoginSuccess')
  }

  const handleOnFetchUserProfileSuccess = () => {}

  const handleOnCheckoutSuccess = (data: IOnCheckoutSuccess) => {
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
  //#endregion

  useEffect(() => {
    if (cartProps) {
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
      setComponentToShow(ComponentEnum.PurchaseConfirmation)
    }
  }, [isPaymentSuccess])

  useEffect(() => {
    if (selectedOrderDetails) {
      setComponentToShow(ComponentEnum.MyOrderDetails)
    }
  }, [selectedOrderDetails])

  const RenderComponent = () => {
    switch (componentToShow) {
      case ComponentEnum.BillingInfo:
        return (
          <BillingInfo
            cartProps={cartProps!}
            onLoginSuccess={handleOnLoginSuccess}
            onFetchUserProfileSuccess={handleOnFetchUserProfileSuccess}
            onCheckoutSuccess={handleOnCheckoutSuccess}
            privacyPolicyLinkStyle={{
              color: Color.primary,
            }}
            styles={{
              customCheckbox: {
                text: {
                  color: Color.textMain,
                },
              },
              passwordTitle: {
                color: Color.textMain,
              },
              checkboxStyles: {
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
              headers: {
                color: Color.textMain,
              },
              texts: {
                color: Color.textMain,
              },
              dropdownStyles: {
                button: {
                  borderColor: Color.white,
                },
                label: {
                  color: Color.textMain,
                },
                icon: {
                  tintColor: Color.white,
                },
              },
              titles: {
                color: Color.textMain,
              },
              inputStyles: {
                input: {
                  color: Color.textMain,
                },
                baseColor: Color.white,
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
                  logo: {
                    tintColor: Color.textMain,
                  },
                  input: {
                    baseColor: Color.textMain,
                  },
                  loginButton: {
                    button: {
                      backgroundColor: Color.primary,
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
            styles={{
              exitButton: {
                container: {
                  width: '100%',
                },
                button: {
                  backgroundColor: Color.primary,
                  borderRadius: 2,
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
          <MyOrders
            onDismissMyOrders={handleOnDismissMyOrders}
            onSelectOrder={handleOnSelectOrder}
          />
        )

      case ComponentEnum.MyOrderDetails:
        return <MyOrderDetails data={selectedOrderDetails!} />

      default:
        return (
          <Tickets
            eventId={EVENT_ID}
            onAddToCartSuccess={handleOnAddToCartSuccess}
            onPressMyOrders={handleOnPressMyOrders}
            onPressLogout={handleOnPressLogout}
            styles={{
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
                },
              },
            }}
          />
        )
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>{RenderComponent()}</SafeAreaView>
  )
}

export default App
