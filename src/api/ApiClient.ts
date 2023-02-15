import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'
import _filter from 'lodash/filter'
import _get from 'lodash/get'
import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'

import { IOnCheckoutSuccess } from '..'
import { IWaitingListFields } from '../components/waitingList/types'
import { Config } from '../helpers/Config'
import { getDomainByClientAndEnv } from '../helpers/Domains'
import {
  deleteAllData,
  getData,
  LocalStorageKeys,
  storeData,
} from '../helpers/LocalStorage'
import { IError, IEvent, IUserProfile } from '../types'
import {
  IAddToCartResponse,
  ITicket,
  ITicketsResponseData,
} from '../types/ITicket'
import Constants from './Constants'
import {
  IAddToCartParams,
  IAddToWaitingListResponse,
  IAuthorizeResponse,
  ICartData,
  ICartResponse,
  ICheckoutBody,
  ICheckoutResponse,
  IClientRequest,
  ICloseSessionData,
  ICloseSessionResponse,
  ICountriesResponse,
  IEventResponse,
  IFetchAccessTokenResponse,
  IFetchTicketsResponse,
  IFreeRegistrationData,
  IFreeRegistrationResponse,
  IMyOrderDetailsData,
  IMyOrderDetailsItem,
  IMyOrderDetailsResponse,
  IMyOrderDetailsTicket,
  IMyOrdersData,
  IMyOrdersResponse,
  IOrderReview,
  IOrderReviewResponse,
  IPostReferralData,
  IPostReferralResponse,
  IPromoCodeResponse,
  IPurchaseConfirmationData,
  IPurchaseConfirmationResponse,
  IRegisterNewUserResponse,
  IRemoveTicketFromResaleData,
  IRemoveTicketFromResaleResponse,
  IResaleTicketData,
  IResaleTicketResponse,
  IResetPasswordRequestData,
  IResetPasswordResponse,
  IRestorePasswordData,
  IRestorePasswordResponse,
  IStatesResponse,
  IUserProfileResponse,
} from './types'

const HEADERS: { [key: string]: any } = {
  Accept: 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
}

export const Client: IClientRequest = Axios.create({
  baseURL: Constants.BASE_URL,
  headers: HEADERS,
  timeout: Constants.TIMEOUT,
  data: {},
}) as IClientRequest

axiosRetry(Client, { retries: 3 })

Client.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const guestToken = await getData(LocalStorageKeys.AUTH_GUEST_TOKEN)
  const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
  const storedTokenType = await getData(LocalStorageKeys.AUTH_TOKEN_TYPE)
  const tokenType = storedTokenType || 'Bearer'

  if (accessToken) {
    const updatedHeaders = {
      ...config.headers,
      Authorization: `${tokenType} ${accessToken}`,
    }
    config.headers = updatedHeaders
  }

  if (guestToken) {
    Client.setGuestToken(guestToken)
    const updatedHeaders = {
      ...config.headers,
      'Authorization-Guest': guestToken,
    }
    config.headers = updatedHeaders
  }

  if (Config.CLIENT) {
    const updatedHeaders = {
      ...config.headers,
      origin: getDomainByClientAndEnv(Config.CLIENT, Config.ENV),
    }
    config.headers = updatedHeaders
  }

  return config
})

Client.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response', response.config.url)
    console.log('Response', response.request)
    return response
  },
  async (error: AxiosError) => {
    if (error?.response?.status === 401) {
      error.code = error.code
      error.message = error.response.data.error_description
    } else if (error.message) {
      error.message = error.message
    }

    return Promise.reject(error)
  }
)

Client.setGuestToken = (token: string) =>
  (Client.defaults.headers.common['Authorization-Guest'] = token)

Client.removeGuestToken = () =>
  delete Client.defaults.headers.common['Authorization-Guest']

Client.removeAccessToken = () =>
  delete Client.defaults.headers.common.Authorization

Client.setAccessToken = (token: string) =>
  (Client.defaults.headers.common.Authorization = token)

Client.setBaseUrl = (baseUrl: string) => (Client.defaults.baseURL = baseUrl)

Client.setTimeOut = (timeOut: number) => (Client.defaults.timeout = timeOut)

Client.setDomain = (domain: string) =>
  (Client.defaults.headers = {
    ...Client.defaults.headers,
    //@ts-ignore
    origin: domain,
  })

Client.setContentType = (contentType: string) =>
  (Client.defaults.headers.common['Content-Type'] = contentType)

export const setCustomHeader = (response: any) => {
  const guestHeaderResponseValue = _get(response, 'headers.authorization-guest')

  const guestHeaderExistingValue = _get(
    response,
    'config.headers[Authorization-Guest]'
  )

  const guestHeader = guestHeaderResponseValue || guestHeaderExistingValue

  if (guestHeader) {
    storeData(LocalStorageKeys.AUTH_GUEST_TOKEN, guestHeader)
    Client.setGuestToken(guestHeader)
  }
}

export const setAccessTokenHandler = async (accessToken: string) => {
  await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)
  Client.setAccessToken(accessToken)
}

// API Authentication
export const authorize = async (
  data: FormData
): Promise<IAuthorizeResponse> => {
  let responseError: IError | undefined

  const response = await Client.post(
    `/v1/oauth/authorize-rn?client_id=${Config.CLIENT_ID}`,
    data
  ).catch((error: AxiosError) => {
    responseError = {
      message: error?.response?.data.message || 'Authorization failed',
      code: error?.response?.status,
    }
  })

  return {
    error: responseError,
    code: response?.data?.data?.code,
  }
}

export const fetchAccessToken = async (
  data: FormData
): Promise<IFetchAccessTokenResponse> => {
  let responseError: IError | undefined
  const response = await Client.post('/v1/oauth/access_token', data).catch(
    (error: AxiosError) => {
      responseError = {
        message: error.response?.data.message,
        code: error.response?.status,
      }
    }
  )

  const accessToken = _get(response, 'data.access_token')
  if (accessToken) {
    await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)
  }
  const refreshToken = _get(response, 'data.refresh_token')
  if (refreshToken) {
    await storeData(LocalStorageKeys.REFRESH_TOKEN, refreshToken)
  }
  const tokenType = _get(response, 'data.token_type')
  if (tokenType) {
    await storeData(LocalStorageKeys.TOKEN_TYPE, tokenType)
  }
  const scope = _get(response, 'data.scope')
  if (scope) {
    await storeData(LocalStorageKeys.AUTH_SCOPE, scope)
  }

  return {
    accessTokenError: responseError,
    accessTokenData: {
      accessToken,
      refreshToken,
      tokenType,
      scope,
    },
  }
}

export const fetchUserProfile = async (): Promise<IUserProfileResponse> => {
  const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
  if (!accessToken) {
    return { userProfileError: { message: 'Access token not found' } }
  }

  let responseError: IError | undefined
  let userProfile: IUserProfile | undefined

  const response: AxiosResponse | void = await Client.get(
    '/customer/profile/',
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).catch((error: AxiosError) => {
    responseError = {
      message: error?.response?.data?.message,
      code: error.response?.status!,
    }
  })

  if (!responseError && response) {
    userProfile = response.data.data
  }

  return {
    userProfileError: responseError,
    userProfileData: userProfile,
  }
}

//#region Register new user
export const registerNewUser = async (
  data: FormData
): Promise<IRegisterNewUserResponse> => {
  const resultData: IRegisterNewUserResponse = {
    registerNewUserResponseError: undefined,
    registerNewUserResponseData: undefined,
  }

  const res: AxiosResponse | void = await Client.post(
    '/v1/oauth/register-rn',
    data
  ).catch((error: AxiosError) => {
    resultData.registerNewUserResponseError = error.response?.data.message

    if (error.response?.data.message.email) {
      resultData.registerNewUserResponseError = {
        isAlreadyRegistered: true,
        message:
          'It appears this email is already attached to an account. Please log in here to complete your registration.',
        raw: error.response,
      }
    }
  })

  if (res?.status === 200) {
    const userProfile = _get(res, 'data.data.attributes.user_profile')
    const accessToken = _get(res, 'data.data.attributes.access_token')
    const refreshToken = _get(res, 'data.data.attributes.refresh_token')
    const scope = _get(res, 'data.data.attributes.scope')
    const tokenType = _get(res, 'data.data.attributes.token_type')

    if (accessToken) {
      await storeData(LocalStorageKeys.ACCESS_TOKEN, accessToken)
      await setAccessTokenHandler(accessToken)
    }

    if (refreshToken) {
      await storeData(LocalStorageKeys.REFRESH_TOKEN, refreshToken)
    }

    if (tokenType) {
      await storeData(LocalStorageKeys.TOKEN_TYPE, tokenType)
    }

    if (scope) {
      await storeData(LocalStorageKeys.AUTH_SCOPE, scope)
    }

    resultData.registerNewUserResponseData = {
      accessTokenData: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenType: tokenType,
        scope: scope,
      },
      userProfile: {
        firstName: _get(userProfile, 'first_name'),
        lastName: _get(userProfile, 'last_name'),
        email: _get(userProfile, 'email'),
      },
    }
  }

  return resultData
}
//#endregion

//#region Waiting List
export const addToWaitingList = async (
  values: IWaitingListFields
): Promise<IAddToWaitingListResponse> => {
  const requestData = {
    data: {
      attributes: values,
    },
  }

  let responseError: IError | undefined
  const response: AxiosResponse | void = await Client.post(
    `/v1/event/${Config.EVENT_ID}/add_to_waiting_list`,
    requestData
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message,
      code: error.response?.status!,
    }
  })

  return {
    addToWaitingListError: responseError,
    addToWaitingListData: response?.data,
  }
}
//#endregion

//#region MyOrders
export const fetchMyOrders = async (
  page: number = 1,
  filter: string = ''
): Promise<IMyOrdersResponse> => {
  const limit = 20
  const data: IMyOrdersData = {
    events: [],
    orders: [],
  }
  let responseError: IError | undefined

  const withFilterEvent = filter ? `&filter[event]=${filter}` : ''
  const withBrand = Config.BRAND ? `&filter[brand]=${Config.BRAND}` : ''
  const withSubBrands = Config.ARE_SUB_BRANDS_INCLUDED
    ? `&filter[subbrands]=${Config.ARE_SUB_BRANDS_INCLUDED}`
    : ''
  const endpoint = `/v1/account/orders/?page=${page}&limit=${limit}${withFilterEvent}${withBrand}${withSubBrands}`

  const response: AxiosResponse | void = await Client.get(endpoint).catch(
    (error: AxiosError) => {
      responseError = {
        message: error.response?.data.message || 'Error fetching My Orders',
        code: error.response?.status,
      }
    }
  )

  if (response?.data) {
    data.events = response.data.data.attributes.purchased_events
    data.orders = response.data.data.attributes.orders
  }

  return {
    myOrdersError: responseError,
    myOrdersData: data,
  }
}
//#endregion

//#region OrderDetails
export const fetchOrderDetails = async (
  orderId: string
): Promise<IMyOrderDetailsResponse> => {
  let responseError: IError | undefined
  let responseData: IMyOrderDetailsData | undefined

  const response = await Client.get(`/v1/account/order/${orderId}`).catch(
    (error: AxiosError) => {
      responseError = {
        message:
          error.response?.data.message || 'Error while fetching order details',
        code: error.response?.status,
      }
    }
  )

  if (!responseError && response) {
    const { attributes } = response.data.data
    let items: IMyOrderDetailsItem[] | undefined

    if (attributes.items?.ticket_types) {
      items = _map(attributes.items.ticket_types, (item) => {
        return {
          name: item.name,
          currency: item.currency,
          price: item.price,
          discount: item.discount,
          quantity: item.quantity,
          total: item.total,
          isActive: item.active,
          hash: item.hash,
        }
      })
    }

    const tickets: IMyOrderDetailsTicket[] = _map(
      attributes.tickets,
      (item) => {
        return {
          hash: item.hash,
          ticketType: item.ticket_type,
          holderName: item.holder_name,
          status: item.status,
          pdfLink: item.pdf_link,
          qrData: item.qr_data,
          isSellable: item.is_sellable,
          holderEmail: item.holder_email,
          holderPhone: item.holder_phone,
          description: item.description,
          descriptionPlain: item.description_plain,
          currency: item.currency,
          eventName: item.event_name,
          isOnSale: item.is_on_sale,
          resaleFeeAmount: item.resale_fee_amount,
          ticketTypeHash: item.ticket_type_hash,
        }
      }
    )
    responseData = {
      header: {
        isReferralDisabled: attributes.disable_referral,
        shareLink: attributes.personal_share_link,
        salesReferred: attributes.sales_referred,
        total: attributes.total,
      },
      items: items,
      tickets: tickets,
    }
  }

  return {
    orderDetailsError: responseError,
    orderDetailsData: responseData,
  }
}

//#endregion

//#region Tickets
export const fetchTickets = async (
  promoCode?: string
): Promise<IFetchTicketsResponse> => {
  const eventId = Config.EVENT_ID.toString()
  const headers = {
    'Promotion-Event': eventId,
    'Promotion-Code': promoCode,
  }

  let responseError

  if (!promoCode) {
    //@ts-ignore
    delete headers['Promotion-Event']
    //@ts-ignore
    delete headers['Promotion-Code']
  }

  const response = await Client.get(`v1/event/${eventId}/tickets/`, {
    //@ts-ignore
    headers: headers,
  }).catch((error: AxiosError) => {
    if (error.response) {
      responseError = {
        code: error.response.status!,
        message: error.response.data.message,
      }
    } else {
      responseError = {
        message: error.message,
      }
    }
  })

  if (responseError) {
    return {
      error: responseError,
    }
  }

  const attributes = _get(response, 'data.data.attributes.tickets')
  const ticketsAttributes = _filter(
    attributes,
    (item) => typeof item === 'object'
  )
  const promoCodeResult: IPromoCodeResponse = {
    message: _get(response, 'data.data.attributes.PromoCodeValidationMessage'),
    isValid: _get(response, 'data.data.attributes.ValidPromoCode'),
  }

  const tickets = (Object.values(ticketsAttributes) || []) as ITicket[]
  const guestHeaderValue = _get(response, 'headers.authorization-guest')
  if (guestHeaderValue) {
    setCustomHeader(response)
  }

  return {
    tickets: _sortBy(tickets, 'sortOrder'),
    error: responseError,
    promoCodeResult: promoCodeResult,
    isInWaitingList: _get(response, 'data.data.attributes.showWaitingList'),
    isAccessCodeRequired: _get(response, 'data.data.attributes.is_access_code'),
  }
}
//#endregion Tickets

export const addToCart = async (
  data: IAddToCartParams
): Promise<IAddToCartResponse> => {
  let responseError: IError | undefined
  let responseData: ITicketsResponseData | undefined

  const response: AxiosResponse | void = await Client.post(
    `v1/event/${Config.EVENT_ID}/add-to-cart/`,
    {
      data,
    }
  ).catch((error: AxiosError) => {
    responseError = {
      code: error.response?.status!,
      message: error.response?.data.message,
    }
  })

  if (!responseError) {
    setCustomHeader(response)
    responseData = {
      isBillingRequired:
        !response?.data?.data?.attributes?.skip_billing_page ?? true,
      isNameRequired: response?.data?.data?.attributes?.names_required ?? false,
      isAgeRequired: response?.data?.data?.attributes?.age_required ?? false,
      isPhoneRequired:
        response?.data?.data?.attributes?.phone_required ?? false,
      minimumAge: undefined,
    }

    if (response?.data?.data?.attributes?.age_required) {
      responseData.minimumAge =
        response?.data?.data?.attributes?.minimum_age ?? 18
    }
  }

  return {
    data: responseData,
    error: responseError,
  }
}

export const fetchEvent = async (): Promise<IEventResponse> => {
  let responseError: IError | undefined
  let event: IEvent | undefined
  const response: AxiosResponse | void = await Client.get(
    `v1/event/${Config.EVENT_ID}`,
    {
      headers: HEADERS,
    }
  ).catch((error: AxiosError) => {
    responseError = {
      code: error?.response?.data.status,
      message: error.response?.data.message,
    }
  })

  if (response?.status === 200) {
    event = response.data.data.attributes
  }

  return {
    eventError: responseError,
    eventData: event,
  }
}

export const postReferralVisit = async (
  referralId: string
): Promise<IPostReferralResponse> => {
  const eventId = Config.EVENT_ID.toString()
  const referralIdNumber = parseInt(referralId, 10)
  let responseError: IError | undefined
  let responseData: IPostReferralData | undefined

  const response: AxiosResponse | void = await Client.post(
    `v1/event/${eventId}/referrer/`,
    {
      referrer: referralIdNumber,
    }
  ).catch((error: AxiosError) => {
    if (error.response?.data.errors && error.response?.data.errors.length > 0) {
      responseError = {
        code: error.response?.data.errors[0].status,
        message: error.response?.data.errors[0].details,
      }
    } else {
      responseError = {
        message: error.response?.data.message,
        code: error.response?.status!,
      }
    }

    if (error.response?.status === 422 && responseError.message === undefined) {
      responseError.message = 'Cannot process request'
    }
  })

  if (response?.data && response.data.status === 200) {
    responseData = {
      message: response.data.message,
      status: response.data.status,
    }
  }

  return {
    postReferralData: responseData,
    postReferralError: responseError,
  }
}
//#region Unlock Password Protected Event
export const unlockPasswordProtectedEvent = async (
  password: string
): Promise<IEventResponse> => {
  const eventId = Config.EVENT_ID.toString()
  let responseError: IError | undefined
  let responseData: any | undefined

  const body = {
    attributes: {
      data: {
        password: password,
      },
    },
  }

  const response: AxiosResponse | void = await Client.post(
    `v1/event/${eventId}/authenticate`,
    body
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message || 'Error while unlocking Event',
      code: error?.response?.status,
    }
  })

  if (response?.data) {
    responseData = {
      message: response.data.message,
      status: response.data.status,
    }

    const guestHeaderValue = _get(response, 'headers.authorization-guest')
    if (guestHeaderValue) {
      setCustomHeader(response)
    }
  }

  return {
    eventData: responseData,
    eventError: responseError,
  }
}
//#endregion Unlock Password Protected Event

//#region Billing Information
export const fetchCountries = async (): Promise<ICountriesResponse> => {
  let responseError: IError | undefined
  const response: AxiosResponse | void = await Client.get('/countries/').catch(
    (error: AxiosError) => {
      responseError = {
        message: error.response?.data.message,
        code: error.response?.status!,
      }
    }
  )

  if (response?.status === 200) {
    setCustomHeader(response)
  }

  return {
    countriesData: response?.data.data,
    countriesError: responseError,
  }
}

export const fetchStates = async (
  countryId: string
): Promise<IStatesResponse> => {
  let responseError: IError | undefined
  const response: void | AxiosResponse = await Client.get(
    `/countries/${countryId}/states/`
  ).catch((ex: AxiosError) => {
    responseError = {
      code: ex.response?.status!,
      message: ex.response?.data.message,
    }
  })

  if (response?.status === 200) {
    setCustomHeader(response)
  }

  return {
    statesError: responseError,
    statesData: response?.data?.data,
  }
}

export const fetchCart = async (): Promise<ICartResponse> => {
  let responseError: IError | undefined
  let cartData = {} as ICartData
  const res: AxiosResponse | void = await Client.get('v1/cart/').catch(
    (error: AxiosError) => {
      responseError = {
        code: error.response?.status!,
        message: error.response?.data.message,
      }
    }
  )

  if (res?.data?.data?.attributes) {
    const attr = res?.data?.data?.attributes
    const quantityString = _get(attr, 'cart[0].quantity', '1')
    const tfOptIn = _get(attr, 'ttfOptIn', false)
    const isMarketingOptedIn = _get(attr, 'optedIn', false)
    const expiresAt = _get(attr, 'expires_at', 420)

    cartData = {
      quantity: parseInt(quantityString, 10),
      isMarketingOptedIn:
        typeof isMarketingOptedIn === 'number'
          ? isMarketingOptedIn > 0
          : isMarketingOptedIn,
      isTfOptInHidden: _get(attr, 'hide_ttf_opt_in', false),
      isTfOptIn: typeof tfOptIn === 'number' ? tfOptIn > 0 : tfOptIn,
      expiresAt: expiresAt,
    }
  } else {
    responseError = {
      message: 'Error fetching cart',
    }
  }

  return {
    cartError: responseError,
    cartData: cartData,
  }
}

export const checkoutOrder = async (
  data: ICheckoutBody
): Promise<ICheckoutResponse> => {
  const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)

  if (!accessToken) {
    return {
      error: {
        message: 'Access token not found',
      },
    }
  }
  let responseError: IError | undefined
  const res: AxiosResponse | void = await Client.post(
    'v1/on-checkout/',
    { data },
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).catch((error: AxiosError) => {
    responseError = {
      code: error.response?.status!,
      message: error.response?.data.message,
    }
  })

  if (!res || !res.data) {
    return { error: responseError }
  }

  const checkoutResponseData: IOnCheckoutSuccess = {
    id: res.data.data.attributes.id,
    hash: res.data.data.attributes.hash,
    total: res.data.data.attributes.total,
    status: res.data.data.attributes.status,
  }

  return {
    error: responseError,
    data: checkoutResponseData,
  }
}
//#endregion

//#region Checkout
export const fetchEventConditions = async (eventId: string) => {
  let responseError: IError | undefined
  const response: AxiosResponse | void = await Client.get(
    `v1/event/${eventId}/conditions`
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data,
      code: error.response?.status!,
    }
  })

  return {
    error: responseError,
    data: response?.data?.data.attributes,
  }
}

export const fetchOrderReview = async (
  hash: string
): Promise<IOrderReviewResponse> => {
  let responseError: IError | undefined

  const response: AxiosResponse | void = await Client.get(
    `v1/order/${hash}/review/`
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message,
      code: error.response?.status!,
    }
  })

  let resData: IOrderReview | undefined

  if (!responseError) {
    const attributes = _get(response, 'data.data.attributes')
    const { cart, order_details, payment_method, billing_info } = attributes

    if (
      !payment_method.stripe_client_secret &&
      order_details.total !== '0.00'
    ) {
      responseError = {
        message: 'Stripe is not configured',
      }
    } else {
      const {
        tickets: [ticket],
      } = order_details

      resData = {
        expiresAt: attributes.expires_at,
        reviewData: {
          event: cart[0]?.product_name,
          price: ticket?.price,
          ticketType: ticket?.name,
          total: order_details?.total,
          numberOfTickets: ticket?.quantity,
          currency: order_details?.currency,
        },
        paymentData: {
          id: payment_method.id,
          name: payment_method.name,
          stripeClientSecret: payment_method.stripe_client_secret,
          stripeConnectedAccount:
            payment_method.stripe_connected_account?.length > 0
              ? payment_method.stripe_connected_account
              : undefined,
          stripePublishableKey: payment_method.stripe_publishable_key,
        },
        addressData: {
          city: billing_info.city,
          line1: billing_info.street_address,
          state: billing_info.state ? billing_info.state.toString() : '',
          postalCode: billing_info.zip,
        },
        billingData: {
          firstName: billing_info.first_name,
          lastName: billing_info.last_name,
        },
      }
    }
  }
  return {
    orderReviewError: responseError,
    orderReviewData: resData,
  }
}

export const postOnPaymentSuccess = async (orderHash: string) => {
  let responseError: IError | undefined

  const response: AxiosResponse | void = await Client.post(
    `v1/order/${orderHash}/success`
  ).catch((error: AxiosError) => {
    responseError = {
      message:
        error.response?.data.message || 'Error while notifying Payment Success',
      code: error.response?.status,
    }
  })

  return {
    error: responseError,
    data: response?.data,
  }
}

export const postOnFreeRegistration = async (
  orderHash: string
): Promise<IFreeRegistrationResponse> => {
  let responseError: IError | undefined
  let responseData: IFreeRegistrationData | undefined

  const res: AxiosResponse | void = await Client.post(
    `v1/order/${orderHash}/complete_free_registration`
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message,
      code: error.response?.status,
    }
  })

  if (res?.data) {
    const orderDetails = res.data.data.attributes.order_details
    responseData = {
      id: orderDetails.id,
      customerId: orderDetails.customer_id,
      total: orderDetails.total,
      currency: orderDetails.currency,
      orderHash: orderDetails.order_hash,
    }
  }
  return {
    freeRegistrationError: responseError,
    freeRegistrationData: responseData,
  }
}
//#endregion

//#region Purchase Confirmation
export const fetchPurchaseConfirmation = async (
  orderHash: string
): Promise<IPurchaseConfirmationResponse> => {
  let responseError: IError | undefined
  let data: IPurchaseConfirmationData | undefined

  const response: AxiosResponse | void = await Client.get(
    `/v1/order/${orderHash}/payment/complete`
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message,
      code: error.response?.status,
    }
  })

  if (response?.data?.data.attributes) {
    const resData = response.data.data.attributes
    data = {
      conversionPixels: resData.conversion_pixels,
      currency: resData.currency,
      customConfirmationPageText: resData.custom_confirmation_page_text,
      customerId: resData.customer_id,
      isReferralDisabled: resData.disable_referral,
      eventDate: resData.event_date,
      eventDescription: resData.event_description,
      eventType: resData.event_type,
      message: resData.message,
      orderTotal: resData.order_total,
      personalShareLink: resData.personal_share_link,
      productId: resData.product_id,
      productName: resData.product_name,
      productImage: resData.product_image,
      productPrice: resData.product_price,
      productUrl: resData.product_url,
      personalShareSales: resData.personal_share_sales,
    }
  }

  return {
    purchaseConfirmationError: responseError,
    purchaseConfirmationData: data,
  }
}
//#endregion

//#region Resale Tickets
export const resaleTicket = async (
  data: FormData,
  orderHash: string
): Promise<IResaleTicketResponse> => {
  let responseError: IError | undefined
  let responseData: IResaleTicketData | undefined

  const response = await Client.post(`v1/ticket/${orderHash}/sell`, data).catch(
    (error: AxiosError) => {
      responseError = {
        message: error.response?.data.message || 'Error while re-sale ticket',
      }
    }
  )

  if (response?.data && response.data.status) {
    responseData = {
      message: response.data.message,
    }
  }

  return {
    resaleTicketData: responseData,
    resaleTicketError: responseError,
  }
}

export const removeTicketFromResale = async (
  orderHash: string
): Promise<IRemoveTicketFromResaleResponse> => {
  let responseError: IError | undefined
  let responseData: IRemoveTicketFromResaleData | undefined

  const response = await Client.delete(`v1/ticket/${orderHash}/sell`).catch(
    (error: AxiosError) => {
      responseError =
        error.response?.data.message || 'Error removing ticket from resale'
    }
  )

  if (response?.data.message && response.data.status === 200) {
    responseData = {
      message: response.data.message,
    }
  }

  return {
    removeTicketFromResaleData: responseData,
    removeTicketFromResaleError: responseError,
  }
}
//#endregion

//#region Logout
export const closeSession = async (): Promise<ICloseSessionResponse> => {
  let responseData: ICloseSessionData | undefined
  let responseError: IError | undefined

  const response: AxiosResponse | void = await Client.delete('/auth').catch(
    (error: AxiosError) => {
      responseError =
        error.response?.data.message || 'Error while closing session'
    }
  )

  if (response?.data && response.data.status && response.data.status === 200) {
    responseData = {
      message: response.data.message || 'Session closed successfully',
    }
  }

  await deleteAllData()

  Client.removeGuestToken()
  Client.removeAccessToken()

  return {
    closeSessionData: responseData,
    closeSessionError: responseError,
  }
}
//endregion Logout

//#region Restore Password
export const requestRestorePassword = async (
  email: string
): Promise<IRestorePasswordResponse> => {
  let responseError: IError | undefined
  let successData: IRestorePasswordData | undefined

  const response: AxiosResponse | void = await Client.post(
    `v1/oauth/restore-password-rn`,
    {
      email: email,
    }
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message || 'Error while restoring password',
      code: error.response?.status,
    }
  })

  if (!responseError && response?.status === 200) {
    successData = {
      message: response.data.message,
      status: response.data.status,
    }
  }

  return {
    data: successData,
    error: responseError,
  }
}
//#endregion

//#region Request Password
export const requestResetPassword = async (
  data: IResetPasswordRequestData
): Promise<IResetPasswordResponse> => {
  let responseError: IError | undefined
  let responseData: any | undefined

  const response: AxiosResponse | void = await Client.post(
    `/auth/reset-password`,
    data
  ).catch((error: AxiosError) => {
    responseError = {
      message: error.response?.data.message || 'Reset password error',
      code: error.response?.data.status,
    }
  })

  if (!responseError && response?.status === 200) {
    responseData = {
      message: response.data.message,
      status: response.status,
    }
  }

  return {
    error: responseError,
    data: responseData,
  }
}
//#endregion Request Password
