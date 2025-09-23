import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Linking, Platform, SafeAreaView, Text, TouchableOpacity, View, Switch } from 'react-native'
import {
  Checkout,
  IMyOrderDetailsData,
  IOnCheckoutSuccess,
  MyOrderDetails,
  MyOrders,
  PurchaseConfirmation,
  Tickets,
  BillingInfo,
  setConfig,
  ITicketsResponseData,
  SkippingStatusType,
  ResaleTickets,
  ResetPassword,
  SessionHandleType,
  CheckoutSP,
} from 'tf-checkout-react-native'
import { IConfig } from '../../src/helpers/Config'
import R from '../../src/res'
import Color from './Colors'
import { ComponentEnum } from './enums'
import styles, { billingInfoStyles } from './styles'
import { IMyOrderDetailsTicket } from '../../src/api/types'

const GOOGLE_IMAGE = require('./google_logo.png')
const AMAZON_IMAGE = require('./amazon_logo.png')


interface IDeepLinkUrl {
  url: string
}

const EVENT_ID = 14065

const config: IConfig = {
  EVENT_ID: EVENT_ID,
  CLIENT: 'ttf',
  BRAND: 'time-slot',
  ARE_SUB_BRANDS_INCLUDED: true,
  ENV: 'STAG',
}

// BRANDS
// mana-onetree-testing-brand
// the-ticket-fairy

const App = () => {
  // Toggle for checkout mode
  const [isSinglePageCheckout, setIsSinglePageCheckout] = useState(false)
  
  const resetPasswordTokenRef = useRef('')
  const isAppLoaded = useRef<null | boolean>(null)

  const billingRef = useRef<SessionHandleType>(null)
  const ticketsRef = useRef<SessionHandleType>(null)


  const [componentToShow, setComponentToShow] = useState<ComponentEnum>(
    ComponentEnum.Tickets
  )
  const [cartProps, setCartProps] = useState<ITicketsResponseData | undefined>(
    undefined
  )

  //#region Loadings
  const [referredId, setReferredId] = useState<undefined | string>(undefined)
  const [isCheckingCurrentSession, setIsCheckingCurrentSession] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [skippingStatus, setSkippingStatus] = useState<SkippingStatusType>(undefined)

  const [checkoutProps, setCheckOutProps] = useState<
    IOnCheckoutSuccess | undefined
  >(undefined)

  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<IMyOrderDetailsData>()

  const [ticketToSell, setTicketToSell] = useState<
    undefined | IMyOrderDetailsTicket
  >(undefined)

  const [isTicketToSellActive, setIsTicketToSellActive] = useState<
    boolean | undefined
  >(undefined)

  // User login state
  const [userFirstName, setUserFirstName] = useState<string>('')
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)

  // Order hash for purchase confirmation (used by single page checkout)
  const [orderHash, setOrderHash] = useState<string>('')
  
  const resetData = () => {
    setCartProps(undefined)
    setIsLoading(false)
    setSkippingStatus(undefined)
    setCheckOutProps(undefined)
    setOrderHash('')
    setComponentToShow(ComponentEnum.Tickets)
    // Keep user login state intact during reset - don't clear userFirstName/isUserLoggedIn
  }
  
  //#region Handlers
  const handleOnPressSellTicket = (ticket: IMyOrderDetailsTicket, isActive: boolean) => {
    setTicketToSell(ticket)
    setIsTicketToSellActive(isActive)
    setComponentToShow(ComponentEnum.ResaleTickets)
  }

  const handleOnAddToCartSuccess = (data: ITicketsResponseData) => {
    setCartProps(data)
    setComponentToShow(isSinglePageCheckout ? ComponentEnum.CheckoutSP : ComponentEnum.BillingInfo)
  }

  const handleOnLoginSuccess = (data: any) => {
    // Extract user info from login response - handle both formats
    let firstName = ''
    
    if (data?.userProfile) {
      // Single page checkout format: { userProfile: { firstName: ... }, accessTokenData: ... }
      firstName = data.userProfile.firstName || data.userProfile.first_name || ''
    } else if (data && (data.firstName || data.first_name || data.user?.firstName)) {
      // Two-step checkout format: { firstName: ... } or { user: { firstName: ... } }
      firstName = data.firstName || data.first_name || data.user?.firstName || ''
    }
    
    if (firstName) {
      setUserFirstName(firstName)
      setIsUserLoggedIn(true)
    }
  }

  const handleOnFetchUserProfileSuccess = (userProfile?: any) => {
    // If user profile is fetched successfully, user is logged in
    if (userProfile && (userProfile.firstName || userProfile.first_name)) {
      const firstName = userProfile.firstName || userProfile.first_name || ''
      setUserFirstName(firstName)
      setIsUserLoggedIn(true)
    }
  }

  const handleOnCheckoutSuccess = (data: IOnCheckoutSuccess) => {
    setCheckOutProps(data)
    if(!isSinglePageCheckout) {
      setComponentToShow(ComponentEnum.Checkout)
    }
  }

  const handleOnPaymentSuccess = () => {
    setComponentToShow(ComponentEnum.PurchaseConfirmation)
  }

  const handleOnComplete = () => {
    resetData()
  }

  const handleOnSelectOrder = (order: IMyOrderDetailsData) => {
    setSelectedOrderDetails(order)
    setComponentToShow(ComponentEnum.MyOrderDetails)
  }

  const handleOnPressMyOrders = () => {
    setComponentToShow(ComponentEnum.MyOrders)
  }

  const handleOnPressLogout = () => {
    setUserFirstName('')
    setIsUserLoggedIn(false)
  }

  const handleOnDismissMyOrders = () => {
    setComponentToShow(ComponentEnum.Tickets)
  }

  const handleOnDismissResaleTickets = () => {
    setComponentToShow(ComponentEnum.MyOrderDetails)
  }

  const handleStripeError = () => {
    setComponentToShow(ComponentEnum.Tickets)
  }

  const handleGoBackFromOrderDetails = () => {
    setComponentToShow(ComponentEnum.MyOrders)
  }

  const handleOnCartExpired = () => {
    Alert.alert('Cart Expired', 'Your cart has expired. Please select your tickets again.')
    setComponentToShow(ComponentEnum.Tickets)
    setSkippingStatus(undefined)
    setCartProps(undefined)
  }

  //#endregion
  const handleOpenUrl = ({url}: IDeepLinkUrl) => {
    console.log('===  Deep link   ===', url)

    const resetPasswordToken = url.split("token=")

    console.log('%cApp.tsx line:160 resetPasswordToken', 'color: #007acc;', resetPasswordToken);

    if (resetPasswordToken[1])  {
      resetPasswordTokenRef.current = resetPasswordToken[1] 
      setComponentToShow(ComponentEnum.ResetPassword)
    }

    const referrerId = url.split("ttf_r=")
    console.log('%cApp.tsx line:160 resetPasswordToken', 'color: #00FFcc;', referrerId);
    
    if (referrerId[1])  {
      setReferredId(referrerId[1])
      resetData()
      ticketsRef.current?.reloadData()
    }
    
  }

  const getInitialURL = async () => { 
    console.log('getInitialURL')
    const initialUrl = await Linking.getInitialURL();
    console.log('initialUrl', initialUrl)
      if (initialUrl === null) {
        return;
      }

      return handleOpenUrl({url: initialUrl})
  }

  //#region effects
  useEffect(() => {
    setTimeout(() => { ticketsRef.current?.refreshAccessToken() }, 2000)
    const setConfigAsync = async () => {
      setIsCheckingCurrentSession(true)
      await setConfig(config)
      setIsCheckingCurrentSession(false)
    }

    setConfigAsync()
    Linking.addEventListener('url', handleOpenUrl)
    isAppLoaded.current = true

    return () => {
      Linking.removeAllListeners('url')
    }
  }, [])


  useEffect(() => {
    if (selectedOrderDetails) {
      setComponentToShow(ComponentEnum.MyOrderDetails)
    }
  }, [selectedOrderDetails])
  //#endregion

  if (!isAppLoaded.current) {
    getInitialURL()
  }

  // Toggle UI Component
  const RenderToggle = () => (
    <View style={{ backgroundColor: Color.backgroundMain }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.textMainOff
      }}>
        <Text style={{ color: Color.textMain, marginRight: 10, fontWeight: '600' }}>
          Two-Step Checkout
        </Text>
        <Switch
          value={isSinglePageCheckout}
          onValueChange={setIsSinglePageCheckout}
          trackColor={{ false: Color.textMainOff, true: Color.primary }}
          thumbColor={isSinglePageCheckout ? Color.white : Color.white}
        />
        <Text style={{ color: Color.textMain, marginLeft: 10, fontWeight: '600' }}>
          Single Page Checkout
        </Text>
      </View>
    </View>
  )
  const RenderComponent = () => {
    // Two-Step Checkout Mode (existing logic)
    switch (componentToShow) {
      case ComponentEnum.CheckoutSP:
        return (
          <CheckoutSP
            onPaymentSuccess={(orderData) => {
              // For single page checkout, store the hash separately
              if (orderData) {
                setOrderHash(orderData.orderHash)
                setOrderHash(orderData.orderHash)
              }
              handleOnPaymentSuccess()
            }}
            isAgeRequired={cartProps?.isAgeRequired}
            minimumAge={cartProps?.minimumAge}
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
            areAlertsEnabled={true}
            areLoadingIndicatorsEnabled={true}
            shouldCartTimerNotMinimizeOnTap={false}
            userFirstName={userFirstName}
            onLoginSuccess={(data) => {
              handleOnLoginSuccess(data)
            }}
            onLogoutSuccess={() => {
              setUserFirstName('')
              setIsUserLoggedIn(false)
              setComponentToShow(ComponentEnum.Tickets)
              setCartProps(undefined)
              setCheckOutProps(undefined)
            }}
            onCartExpired={handleOnCartExpired}
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
                  dateOfBirth: '_Date of birth_',
                  isSubToBrand: '_Is sub to Brand_',
                  isSubToTicketFairy: '_Is sub to ticket fairy_',
                  password: '_Password_',
                  confirmPassword: '_Confirm password_',
                  emailsAdvice: '_Emails advice_',
                  choosePassword: '_Choose password_',
                },
                checkoutButton: '_Checkout_',
                screenTitle: '_Get your tickets_',
                providePaymentInfo: '_Provide Payment Info_',
                paymentTitle: '_Payment_',
                addonMainTitle: '_UPGRADES & ADD-ONS_',
                addonSubTitle: '_PLEASE SELECT FROM THE OPTIONAL ADD-ONS BELOW_',
                loginTexts: {
                  loginButton: '_Login_',
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
                  loggedIn: {
                    loggedAs: '_Logged in:_',
                    notYou: '_Not you?_',
                  }
                }
            }}
            styles={{
              ...billingInfoStyles,
              // Fix addon styles to prevent black on black
              addonSection: {
                marginBottom: 24,
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: '#ffffff', // Light background
                borderRadius: 16,
              },
              addonMainTitle: {
                fontSize: 20,
                fontWeight: '700',
                color: '#1f2937',  // Dark color for contrast
                textAlign: 'center',
                marginBottom: 8,
              },
              addonSubtitle: {
                fontSize: 14,
                fontWeight: '500',
                color: '#6b7280',  // Medium gray
                textAlign: 'center',
                marginBottom: 20,
              },
              addonItem: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingVertical: 16,
                paddingHorizontal: 16,
                marginBottom: 12,
                backgroundColor: '#f9fafb', // Very light gray
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              },
              addonName: {
                fontSize: 16,
                fontWeight: '600',
                color: '#1f2937',  // Dark text
                marginBottom: 6,
              },
              // Card style fix (match Checkout)
              payment: {
                container: {
                  marginTop: 16,
                  marginBottom: 16,
                },
                title: {
                  fontSize: 16, 
                  fontWeight: '600',
                  marginBottom: 16,
                  color: '#374151'
                },
                cardContainer: {
                  marginTop: 24,
                  minHeight: Platform.OS === 'ios' ? 180 : 270,
                  maxHeight: Platform.OS === 'ios' ? 300 : 350,
                  borderRadius: 10,
                  // padding: 8,
                  alignSelf: 'center',
                },
                cardStyle: {
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }
              },
              // Order review style fix
              orderReview: {
                item: {
                  title: { 
                    color: '#6b7280', 
                    fontSize: 14,
                    fontWeight: '500'
                  },
                  value: { 
                    color: '#1f2937',
                    fontSize: 14,
                    fontWeight: '600'
                  },
                }
              },
            }}
          />
        )
      case ComponentEnum.BillingInfo:
        return (
          <BillingInfo
            config={{
            isCheckoutAlwaysButtonEnabled: true,
            shouldHideTicketHolderSectionOnSingleTicket: true,
            }}
            ref={billingRef}
            onCartExpired={handleOnCartExpired}
            onSkippingStatusChange={setSkippingStatus}
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
            onLoadingChange={setIsLoading}
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
                  isSubToTicketFairy: '_Is sub to ticket fairy_',
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
                  ttfPrivacyPolicyRequiredError: '* Required'
                },
                checkoutButton: '_Checkout_',
                loginTexts: {
                  loginButton: '_Login_',
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
                  loggedIn: {
                    loggedAs: '_Logged in:_',
                    notYou: '_Not you?_',
                  }
                }
            }}
            styles={billingInfoStyles}
            cartProps={cartProps!}
            onCheckoutSuccess={handleOnCheckoutSuccess}
            onLoginSuccess={handleOnLoginSuccess}
            onFetchUserProfileSuccess={handleOnFetchUserProfileSuccess}       
            onLogoutSuccess={() => {
              setUserFirstName('')
              setIsUserLoggedIn(false)
              setComponentToShow(ComponentEnum.Tickets)
              setCartProps(undefined)
              setCheckOutProps(undefined)
            }}    
            />
        )
      case ComponentEnum.Checkout:
        return (
          <Checkout
            checkoutData={checkoutProps!}
            onPaymentSuccess={handleOnPaymentSuccess}
            onPressExit={handleStripeError}
            onLoadingChange={(loading) => {setIsLoading(loading)}}
            onCartExpired={handleOnCartExpired}
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
                cardStyle: {
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000'
                },
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
            texts={{
              screenTitle: '_Get your tickets_',
              title: '_GET YOUR TICKETS_',
              subTitle: '_Order review_',
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
        )
      case ComponentEnum.PurchaseConfirmation:
        return (
          <PurchaseConfirmation
            orderHash={orderHash || checkoutProps?.hash || ''}
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
                areAlertsEnabled: true,
              }}
              onFetchMyOrdersSuccess={(data) => {
                console.log('onFetchMyOrdersSuccess', data)
              }}
              onLoadingChange={(loading) => setIsLoading(loading)}
              onSelectOrder={handleOnSelectOrder}
              styles={{
                timeFilters: { 
                  container: {
                    paddingHorizontal: 16
                  }
                },
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
                selectEventPlaceholder: '_CUSTOM EVENT_',
                selectTimeFilterPlaceholder: 'Custom placeholder time filter'
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
                bottomSheetModal:{
                  content: {
                    backgroundColor: R.colors.primary
                  },
                  headerContainer: {
                    justifyContent: 'space-between',
                  },
                  title: {
                    color: R.colors.white,
                  },
                },
                
                ticketActions:{
                  buttonContainer:{
                    height: 50,
                    marginVertical: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomColor: R.colors.disabled,
                    borderBottomWidth: 1
                  },
                  text: {
                    color: R.colors.white,
                    fontSize: 20,
                    textAlignVertical: 'center',
                  }
                },
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
                  rootContainer: {
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
                  moreButtonIcon: {
                    tintColor: R.colors.white
                  }
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
                      maxWidth: '70%',
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
                ticketsTitle: '_Ticket_List_Title_',

                listItem: {
                  title: '_Item_List_Title_',
                  price: '_Price_',
                  ticketType: '_Ticket_Type_',
                  quantity: '_Quantity_',
                  total: '_Total_',
                },
                ticketItem: {
                  ticketId: '_Ticket_Id_',
                  ticketType: '_Ticket_Type_',
                  holderName: '_Ticket_Holder_',
                  status: '_Status_',
                  download: '_Download_',
                  sellTicket: '_Sell_Ticket_',
                  removeTicketFromResale: 'removeTicketFromResale',
                },
                copyText: {
                  copy: '_Copy_',
                  copied: '_Copied_',
                },
                referral: {
                  soFar: '_SO FAR_',
                  tickets: '_TICKETS_'
                },
                bottomSheetModal: {
                  title: '_Ticket_Actions_',
                },
                ticketActions: {
                  downloadPdf: '_Download_PDF_',
                  sell: '_Sell_Ticket_',
                }
              }}
              onPressResaleTicket={handleOnPressSellTicket} 
              onRemoveTicketFromResaleSuccess={(message) => {
                console.log('onRemoveTicketFromResaleSuccess', message)
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

        case ComponentEnum.ResetPassword:
          return (
            <View style={{ flex: 1}}>
              <ResetPassword
              styles={{
                apiSuccess: {
                  fontSize: 18,
                  fontWeight: '800',
                  marginVertical: 16,
                  color: Color.validationGreen,
                  textAlign: 'center'
                }
              }}
                token={resetPasswordTokenRef.current}
                onPressResetButton={() => {
                  console.log('OnPressResetPassword')
                }}
                onPressCancelButton={() => {
                  resetPasswordTokenRef.current = ''
                  setComponentToShow(ComponentEnum.Tickets)
                }}
                onResetPasswordSuccess={(data) => {
                  setTimeout(() => { 
                    resetPasswordTokenRef.current = ''
                    setComponentToShow(ComponentEnum.Tickets)
                   }, 5000)
                }}
                onResetPasswordError={(error)=> {}}
              />
            </View>
          )

        case ComponentEnum.ResaleTickets:
        return (
          <View style={{flex: 1}}>
            <ResaleTickets
                texts={{
                  title: '_Resale Tickets_',
                }}
                ticket={ticketToSell!}
                styles={{
                  title: {
                    color: Color.textMain,
                    fontSize: 20,
                    fontWeight: '700',
                    marginLeft: 16,
                  },
                  ticketOrderDetails: {
                    rootContainer: {
                      marginVertical: 16,
                      paddingHorizontal: 16,
                    },
                    title: {
                      color: Color.textMain,
                      fontSize: 18,
                    },
                    label: {
                      color: Color.textMainOff,
                    },
                    value: {
                      color: Color.textMain,
                    },
                  },
                  termsCheckbox: {
                    container: {
                      marginTop: 16
                    },
                    text: {
                      color: Color.textMain,
                    },
                    indicator: {
                      backgroundColor: Color.validationGreen,
                    },
                    indicatorDisabled: {
                      borderColor: Color.white
                    }
                  },
                  ticketBuyerForm: {
                    rootContainer: {
                      paddingHorizontal: 16,
                      marginBottom: 16,
                    },
                    inputs: {
                      baseColor: Color.textMain,
                      input: {
                        color: Color.textMain,
                      },
                      errorColor: Color.danger,
                    },
                    radioButtons: {
                      rootContainer: {
                        marginVertical: 8,
                      },
                      indicator: {
                        backgroundColor: Color.textMain,
                      },
                      radio: {
                        borderColor: Color.textMainOff,
                      },
                      text: {
                        color: Color.textMain,
                      },
                    },
                    title: {
                      fontSize: 20,
                      fontWeight: '700',
                      marginBottom: 16,
                      color: Color.textMain,
                    },
                    formContainer: {
                      marginVertical: 16,
                    },
                  },
                  resaleTicketsButton: {
                    button: {
                      backgroundColor: Color.primary,
                      width: '70%',
                      borderRadius: 2,
                    },
                    container: {
                      marginBottom: 32
                    },
                  },
                  resaleTicketsButtonDisabled: {
                    container: {
                      marginBottom: 32
                    },
                    button: {
                      backgroundColor: Color.gray20,
                      width: '70%',
                      borderRadius: 2,
                    },
                  },
                  terms: {
                    rootContainer: {
                      marginTop: 16,
                      paddingHorizontal: 16,
                    },
                    title: {
                      color: Color.textMain,
                      fontSize: 20,
                      fontWeight: '700',
                      marginBottom: 16,
                    },
                    item: {
                      color: Color.textMain,
                    },
                    itemBold: {
                      fontWeight: '900',
                    },
                  },
                
                  
                }}
                onResaleTicketsSuccess={(resaleTicketData, ticket) => {
                  const newOrderDetails: IMyOrderDetailsData = { ...selectedOrderDetails! }
                  _.forEach(newOrderDetails.tickets, (itm) => {
                    if (itm.hash === ticket.hash) {
                      itm.isOnSale = true
                      itm.isSellable = false
                    }
                  })

                  setSelectedOrderDetails(newOrderDetails)
                  setComponentToShow(ComponentEnum.MyOrderDetails)
                } } 
                isTicketTypeActive={isTicketToSellActive}            
            />
            <TouchableOpacity
              onPress={handleOnDismissResaleTickets}
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
              ref={ticketsRef}
              referrerId={referredId}
              config={{
                areTicketsGrouped: false,
              }}
              isCheckingCurrentSession={isCheckingCurrentSession}
              onLoadingChange={(loading) => setIsLoading(loading)}
              onFetchTicketsError={(error) => {
                console.log(`onFetchTicketsError`, error)
              }}
              onFetchEventError={(error) => console.log('onFetchEventError', error)}
              onAddToCartSuccess={handleOnAddToCartSuccess}
              onPressLogout={handleOnPressLogout}
              onPressMyOrders={handleOnPressMyOrders}
              styles={{
                enterPassword: {
                  rootContainer: {
                    backgroundColor: 'white', 
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }, 
                  contentContainer: {
                    paddingHorizontal: 32
                  },
                  title: {
                    fontWeight: '900',
                    fontSize: 30,
                    marginBottom: 24,
                    color: 'black'
                  }
                },
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
                  sectionHeader: {
                    container: {
                      padding: 8,
                      backgroundColor: Color.gray40
                    },
                    title: {
                      fontWeight: '800'
                    }
                  },
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
                item: {
                  ticket: '_TICKET_'
                },
                loggedInTexts:{
                  logOutButtonText: '_LOGOUT_',
                  myOrderButtonText: '_MY_ORDERS_',  
                }
              }}
            />
          </View>
        )
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {componentToShow === ComponentEnum.Tickets && <RenderToggle />}
      {RenderComponent()}
    </SafeAreaView>
  )
}

export default App
