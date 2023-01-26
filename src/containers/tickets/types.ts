import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IEventData } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import {
  IEnterPasswordStyles,
  IEnterPasswordTexts,
} from '../../components/enterPassword/types'
import { ILoadingStyles } from '../../components/loading/types'
import {
  ILoggedInStyles,
  ILoggedInTexts,
} from '../../components/loggedIn/types'
import {
  IPromoCodeStyles,
  IPromoCodeTexts,
} from '../../components/promoCode/types'
import {
  IWaitingListStyles,
  IWaitingListTexts,
} from '../../components/waitingList/types'
import { IGroupedTickets } from '../../core/TicketsCore/TicketsCoreTypes'
import {
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicket,
  ITicketsResponseData,
} from '../../types'
import { IError } from '../../types/IError'
import { ITicketListItemStyles, ITicketListItemTexts } from './components/types'

export interface ITicketsViewProps {
  isGettingTickets?: boolean
  isBookingTickets?: boolean
  isGettingEvent?: boolean
  tickets: ITicket[]
  groupedTickets: IGroupedTickets[]
  areTicketsGroupsShown?: boolean
  styles?: ITicketsViewStyles
  onPressGetTickets: () => void
  onPressApplyPromoCode: (promoCode: string) => void
  promoCodeValidationMessage?: string
  isPromoCodeValid?: boolean | number
  onSelectTicketOption: (selectedTicket: ISelectedTicket) => void
  selectedTicket?: ISelectedTicket
  texts?: ITicketsViewTexts
  event?: IEvent
  isWaitingListVisible?: boolean
  isGetTicketsButtonVisible?: boolean
  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean
  isUserLogged?: boolean
  isCheckingCurrentSession?: boolean
  onPressMyOrders: () => void
  onPressLogout: () => void

  areLoadingIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean

  // Callbacks for Waiting list
  onAddToWaitingListSuccess?: () => void
  onAddToWaitingListError?: (error: IError) => void
  onLoadingChange?: (isLoading: boolean) => void
  promoCodeCloseIcon?: ImageSourcePropType

  // Event password protected
  onPressSubmitEventPassword?: (password: string) => void
  passwordProtectedEventData?: IPasswordProtectedEventData
}

export interface ITicketListStyles {
  listContainer?: ViewStyle
  item?: ITicketListItemStyles
  sectionHeader?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
  }
}

export interface ITicketsViewStyles {
  rootContainer?: ViewStyle
  container?: ViewStyle
  title?: TextStyle
  getTicketsButtonDisabled?: IButtonStyles
  getTicketsButtonActive?: IButtonStyles
  promoCode?: IPromoCodeStyles
  ticketList?: ITicketListStyles
  loading?: ILoadingStyles
  waitingList?: IWaitingListStyles
  loggedIn?: ILoggedInStyles
  enterPassword?: IEnterPasswordStyles
  showPasswordIcon?: StyleProp<ImageStyle>
}

export interface ITicketsViewTexts {
  promoCode?: IPromoCodeTexts
  getTicketsButton?: string
  title?: string
  item?: ITicketListItemTexts
  loggedInTexts?: ILoggedInTexts
  listItem?: ITicketListItemTexts
  waitingList?: IWaitingListTexts
  enterPassword?: IEnterPasswordTexts
}

export interface ITicketsConfig {
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
  areTicketsSortedBySoldOut?: boolean
  areTicketsGrouped?: boolean
}

export interface ITicketsProps {
  // Callbacks for when user taps on GET Tickets button
  onAddToCartSuccess: (data: ITicketsResponseData) => void
  onAddToCartError?: (error: IError) => void

  // Callbacks for fetching the tickets
  onFetchTicketsSuccess?: (data: IOnFetchTicketsSuccess) => void
  onFetchTicketsError?: (error: IError) => void

  // Callbacks for fetching the Event
  onFetchEventError?: (error: IError) => void
  onFetchEventSuccess?: (data: IEventData) => void

  // Callbacks for fetching Password Protected Event
  onUnlockPasswordProtectedEventError?: (error: IError) => void
  onUnlockPasswordProtectedEventSuccess?: (data: IEventData) => void

  // Callbacks for Waiting list
  onAddToWaitingListSuccess?: () => void
  onAddToWaitingListError?: (error: IError) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean

  onPressMyOrders: () => void
  onPressLogout?: () => void

  onLoadingChange?: (isLoading: boolean) => void
  promoCodeCloseIcon?: ImageSourcePropType

  config?: ITicketsConfig

  isCheckingCurrentSession?: boolean
}

export interface IPasswordProtectedEventData {
  isPasswordProtected?: boolean
  message?: string
  apiError?: string
  isLoading?: boolean
}
