import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import _filter from 'lodash/filter'
import _get from 'lodash/get'
import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'

import { IWaitingListFields } from '../components/waitingList/types'
import {
  deleteAllData,
  getData,
  LocalStorageKeys,
  storeData,
} from '../helpers/LocalStorage'
import { IEvent, IUserProfile } from '../types'
import { ITicket } from '../types/ITicket'
import Constants from './Constants'
import {
  IAuthorizeResponse,
  ICheckoutResponse,
  IClientRequest,
  IEventResponse,
  IFetchTicketsResponse,
  IFreeRegistrationData,
  IFreeRegistrationResponse,
  IMyOrderDetailsItem,
  IMyOrderDetailsResponse,
  IMyOrderDetailsTicket,
  IMyOrdersData,
  IMyOrdersResponse,
  IOrderReview,
  IOrderReviewResponse,
  IPromoCodeResponse,
  IRegisterNewUserResponse,
} from './types'

const HEADERS: { [key: string]: any } = {
  Accept: 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
}

export const Client: IClientRequest = Axios.create({
  baseURL: Constants.BASE_URL,
  headers: HEADERS,
}) as IClientRequest

Client.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const guestToken = await getData(LocalStorageKeys.AUTH_GUEST_TOKEN)
  const userData = await getData(LocalStorageKeys.USER_DATA)
  const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)

  if (userData && accessToken) {
    const updatedHeaders = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
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

  return config
})

Client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.log('Interceptor error', error.response)
    if (error?.response?.status === 401) {
      deleteAllData()
    }
    return Promise.reject(error)
  }
)

Client.setGuestToken = (token: string) =>
  (Client.defaults.headers.common['Authorization-Guest'] = token)

Client.setAccessToken = (token: string) =>
  (Client.defaults.headers.common.Authorization = token)

export const setCustomHeader = (response: any) => {
  const guestHeaderResponseValue = _get(response, 'headers.authorization-guest')

  const guestHeaderExistingValue = _get(
    response,
    'config.headers[Authorization-Guest]'
  )

  const guestHeader = guestHeaderResponseValue || guestHeaderExistingValue

  if (guestHeader) {
    storeData(LocalStorageKeys.AUTH_GUEST_TOKEN, guestHeaderResponseValue)
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
  console.log('Authorize data', data)
  let responseError: string = ''
  console.log('Authorize', data)
  const response = await Client.post(
    `/v1/oauth/authorize-rn?client_id=${
      Constants.CLIENT_ID || '4792a61f2fcb49197ab4c2d2f44df570'
    }`,
    data
  ).catch((error: AxiosError) => {
    console.log('SUPER ERROR', error)
    responseError = error?.response?.data.message
  })

  console.log('authorize response', response)
  console.log('authorize responseError', responseError)

  return {
    error: responseError,
    code: response?.data?.data?.code,
  }
}

export const fetchAccessToken = async (data: FormData) => {
  let responseError
  const response = await Client.post('/v1/oauth/access_token', data).catch(
    (error: Error) => {
      responseError = error.message
    }
  )

  return {
    error: responseError,
    accessToken: _get(response, 'data.access_token'),
  }
}

export const fetchUserProfile = async (accessToken: any) => {
  console.log('fetchUserProfile', accessToken)
  let responseError
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
    console.log('fetchUserProfile ERROR', error.response)
    responseError = error.message
  })

  console.log('fetchUserProfile - response', response)
  if (!responseError && response) {
    userProfile = response.data.data
  }

  return {
    error: responseError,
    userProfile: userProfile,
  }
}

//#region Register new user
export const registerNewUser = async (
  data: FormData
): Promise<IRegisterNewUserResponse> => {
  const resultData: IRegisterNewUserResponse = {
    error: undefined,
    data: undefined,
  }

  const res: AxiosResponse | void = await Client.post(
    '/v1/oauth/register-rn',
    data
  ).catch((error: AxiosError) => {
    console.log('Register new user Error', error.response)
    resultData.error = error.response?.data.message

    if (error.response?.data.message.email) {
      resultData.error = {
        isAlreadyRegistered: true,
        message:
          'It appears this email is already attached to an account. Please log in here to complete your registration.',
        raw: error.response,
      }
    }
  })

  console.log('registerNewUser data', res)

  if (res?.status === 200) {
    resultData.data = res.data.data.attributes
    console.log('registerNewUser resultData', resultData.data)

    if (resultData.data?.access_token) {
      await setAccessTokenHandler(resultData.data.access_token)
    }
  }

  return resultData
}
//#endregion

//#region Waiting List
export const addToWaitingList = async (
  id: number,
  values: IWaitingListFields
) => {
  const requestData = {
    data: {
      attributes: values,
    },
  }
  console.log('addToWaitingList - req', requestData)
  console.log('addToWaitingList - eventID', id)

  let responseError = ''
  const response: AxiosResponse | void = await Client.post(
    `/v1/event/${id}/add_to_waiting_list`,
    requestData
  ).catch((error: AxiosError) => {
    console.log('addToWaitingList - error', error.response)
    responseError = error.response?.data.message
  })

  console.log('addToWaitingList - data', response?.data)

  return {
    addToWaitingListError: responseError,
    addToWaitingListData: response?.data,
  }
}
//#endregion

//#region MyOrders
export const fetchMyOrders = async (
  filter: string = ''
): Promise<IMyOrdersResponse> => {
  const page = 1
  const limit = 20
  const data: IMyOrdersData = {
    events: [],
    orders: [],
  }
  let responseError = ''
  const response: AxiosResponse | void = await Client.get(
    `/v1/account/orders/?page=${page}&limit=${limit}&filter[event]=${filter}`
  ).catch((error: AxiosError) => {
    console.log('myorders ERROR', error)
    responseError = error.response?.data.message || 'Error fetching My Orders'
  })

  if (response?.data) {
    data.events = response.data.data.attributes.purchased_events
    data.orders = response.data.data.attributes.orders
  }

  console.log('RESPONSE MY ORDERs', response)
  console.log('RESPONSE MY responseError', responseError)

  return {
    myOrdersError: responseError,
    myOrdersData: data,
  }
}
//&filter[brand]=${CONFIGS.BRAND_SLUG}

export const fetchOrderDetails = async (orderId: string) => {
  let responseError = ''
  let responseData: IMyOrderDetailsResponse | undefined
  const response = await Client.get(`/v1/account/order/${orderId}`).catch(
    (error: AxiosError) => {
      responseError =
        error.response?.data.message || 'Error while fetching order details'
    }
  )

  if (!responseError && response) {
    const { attributes } = response.data.data
    console.log('RESPONSe', response)
    const items: IMyOrderDetailsItem[] = _map(
      attributes.items.ticket_types,
      (item) => {
        return {
          name: item.name,
          currency: item.currency,
          price: item.price,
          discount: item.discount,
          quantity: item.quantity,
          total: item.total,
        }
      }
    )

    const tickets: IMyOrderDetailsTicket[] = _map(
      attributes.tickets,
      (item) => {
        return {
          hash: item.hash,
          ticketType: item.ticket_type,
          holderName: item.holder_name,
          status: item.status,
          pdfLink: item.pdf_link,
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
  id: string | number,
  promoCode: string
): Promise<IFetchTicketsResponse> => {
  const headers = {
    'Promotion-Event': id.toString(),
    'Promotion-Code': promoCode,
  }

  console.log('Fetch tickets promocode', promoCode)
  let responseError

  if (!promoCode) {
    //@ts-ignore
    delete headers['Promotion-Event']
    //@ts-ignore
    delete headers['Promotion-Code']
  }

  console.log('Fetch tickets headers', headers)

  const response = await Client.get(`v1/event/${id}/tickets/`, {
    headers: headers,
  }).catch((error: AxiosError) => {
    responseError = error.response?.data.message
  })

  console.log('Tickets response', response)

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

export const addToCart = async (id: string | number, data: any) => {
  console.log('Add to cart with data', data)
  let responseError
  let responseData
  const response: AxiosResponse | void = await Client.post(
    `v1/event/${id}/add-to-cart/`,
    {
      data,
    }
  ).catch((error: Error) => {
    responseError = error.message
  })

  if (!responseError) {
    setCustomHeader(response)
    responseData = {
      isBillingRequired:
        !response?.data?.data?.attributes?.skip_billing_page ?? true,
      isNameRequired: response?.data?.data?.attributes?.names_required ?? false,
      isAgeRequired: response?.data?.data?.attributes?.age_required ?? false,
    }
  }

  return {
    data: responseData,
    error: responseError,
  }
}

export const fetchEvent = async (
  id: string | number
): Promise<IEventResponse> => {
  console.log('fetchEvent - ID', id)
  let responseError: string | undefined
  let event: IEvent | undefined
  const response: AxiosResponse | void = await Client.get(`v1/event/${id}`, {
    headers: HEADERS,
  }).catch((error: AxiosError) => {
    console.log('fetchEvent - ERROR', error.response)
    responseError = error.response?.data.message
  })

  if (response?.status === 200) {
    event = response.data.data.attributes
  }
  console.log('fetchEvent - Response', response)

  return {
    eventError: responseError,
    eventData: event,
  }
}
//#endregion

//#region Billing Information
export const fetchCountries = async () => {
  let responseError: string = ''
  const response: AxiosResponse | void = await Client.get('/countries/').catch(
    (error: AxiosError) => {
      responseError = error.response?.data.message
    }
  )

  console.log('fetchCountries - res', response)
  console.log('fetchCountries - error', responseError)

  if (response?.status === 200) {
    setCustomHeader(response)
  }

  return {
    data: response?.data.data,
    error: responseError,
  }
}

export const fetchStates = async (countryId: string) => {
  let responseError: string = ''
  const response: void | AxiosResponse = await Client.get(
    `/countries/${countryId}/states/`
  ).catch((ex: AxiosError) => {
    responseError = ex.response?.data.message
  })

  if (response?.status === 200) {
    setCustomHeader(response)
  }

  console.log('fetchStates - res', response)
  console.log('fetchStates - error', responseError)

  return {
    error: responseError,
    data: response?.data?.data,
  }
}

export const fetchCart = async () => {
  let responseError: string = ''
  const res: AxiosResponse | void = await Client.get('v1/cart/').catch(
    (error: AxiosError) => {
      responseError = error.response?.data.message
    }
  )

  console.log('fetchCart - error', responseError)
  console.log('fetchCart - response', res)
  return {
    error: responseError,
    data: res?.data.data.attributes.cart[0],
  }
}

export const checkoutOrder = async (
  data: any,
  accessToken: string
): Promise<ICheckoutResponse> => {
  console.log('Checkout Order Data', data)
  console.log('Checkout Order Access Token', accessToken)
  let responseError = ''
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
    console.log('Checkout Order Error', error.response)
    responseError = error.response?.data.message
  })

  console.log('Checkout Order Response', res)

  return {
    error: responseError,
    data: res,
  }
}
//#endregion

//#region Checkout
export const fetchEventConditions = async (eventId: string) => {
  let responseError
  const response: AxiosResponse | void = await Client.get(
    `v1/event/${eventId}/conditions`
  ).catch((error: AxiosError) => {
    responseError = error.response?.data
  })

  console.log('getConditions response', response)

  return {
    error: responseError,
    data: response?.data?.data.attributes,
  }
}

export const fetchOrderReview = async (
  hash: string
): Promise<IOrderReviewResponse> => {
  let responseError = ''
  console.log(`Fetching Order Review with hash ${hash}`)
  const response: AxiosResponse | void = await Client.get(
    `v1/order/${hash}/review/`
  ).catch((error: AxiosError) => {
    console.log('Fetching Order Review Error', error)
    responseError = error.response?.data.message
  })

  let resData: IOrderReview | undefined

  if (!responseError) {
    console.log('fetch order review - Error', responseError)
    console.log('fetch order review - Data', response)
    const attributes = _get(response, 'data.data.attributes')
    const { cart, order_details, payment_method, billing_info } = attributes

    if (
      !payment_method.stripe_client_secret &&
      order_details.total !== '0.00'
    ) {
      responseError = 'Stripe is not configured'
    } else {
      const {
        tickets: [ticket],
      } = order_details

      resData = {
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
          state: billing_info?.state || '',
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
    error: responseError,
    data: resData,
  }
}

export const postOnPaymentSuccess = async (orderHash: string) => {
  console.log('postOnPaymentSuccess - HASH', orderHash)
  let responseError: string = ''
  const response: AxiosResponse | void = await Client.post(
    `v1/order/${orderHash}/success`
  ).catch((error: AxiosError) => {
    console.log('postOnPaymentSuccess - ERROR RAW', error)
    responseError =
      error.response?.data.message || 'Error while notifying Payment Success'
  })
  console.log('postOnPaymentSuccess - ERROR', responseError)
  console.log('postOnPaymentSuccess - DATA', response)

  return {
    error: responseError,
    data: response?.data,
  }
}

export const postOnFreeRegistration = async (
  orderHash: string
): Promise<IFreeRegistrationResponse> => {
  let responseError = ''
  let responseData: IFreeRegistrationData
  const res: AxiosResponse | void = await Client.post(
    `v1/order/${orderHash}/complete_free_registration`
  ).catch((error: AxiosError) => {
    responseError = error.response?.data.message
  })
  console.log('postOnFreeRegistration', res)

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
export const fetchPurchaseConfirmation = async (orderHash: string) => {
  console.log('fetchPurchaseConfirmation with hash', orderHash)
  let responseError
  const response: AxiosResponse | void = await Client.get(
    `/v1/order/${orderHash}/payment/complete`
  ).catch((error: AxiosError) => {
    responseError = error.response?.data.message
  })

  console.log('fetchPurchaseConfirmation - responseError', responseError)
  console.log('fetchPurchaseConfirmation - response', response)

  return {
    error: responseError,
    data: response,
  }
}
//#endregion
