import type {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import type {
  IMyOrderDetailsData,
  IMyOrdersData,
  IMyOrdersOrder,
} from '../../api/types'
import type {
  IDropdownItem,
  IDropdownStyles,
} from '../../components/dropdown/types'
import type { IError } from '../../types'
import type { IOrderListItemStyles } from './components/types'

export interface IMyOrdersConfig {
  isEventsDropdownHidden?: boolean
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
  isTimeFilterDropdownHidden?: boolean
}

export interface IMyOrdersStyles {
  orderListItem?: IOrderListItemStyles
  safeArea?: StyleProp<ViewStyle>
  listContainer?: StyleProp<ViewStyle>
  eventsContainer?: StyleProp<ViewStyle>
  eventsTitle?: StyleProp<TextStyle>
  refreshControlColor?: ColorValue
  eventsDropdown?: IDropdownStyles
  rootContainer?: StyleProp<ViewStyle>
  eventsSelectionContainer?: StyleProp<ViewStyle>
  clearEventSelectionIcon?: StyleProp<ImageStyle>
  timeFilters?: {
    container?: StyleProp<ViewStyle>
    dropdown?: IDropdownStyles
    selectionContainer?: StyleProp<ViewStyle>
    clearSelectionIcon?: StyleProp<ImageStyle>
  }
}

export interface IMyOrdersTexts {
  selectEventPlaceholder?: string
  selectTimeFilterPlaceholder?: string
  title?: string
  timeFilters?: {
    upcoming?: string
    ongoingAndUpcoming?: string
    ongoing?: string
    past?: string
  }
}

export interface IMyOrdersProps {
  onSelectOrder: (order: IMyOrderDetailsData) => void

  onFetchMyOrdersSuccess?: (data: IMyOrdersData) => void
  onFetchMyOrdersError?: (error: IError) => void

  onFetchOrderDetailsSuccess?: (data: IMyOrderDetailsData) => void
  onFetchOrderDetailsError?: (error: IError) => void

  onRemoveTicketFromResaleSuccess?: (orderHash: string) => void
  onRemoveTicketFromResaleError?: (orderHash: string) => void

  onLoadingChange?: (isLoading: boolean) => void

  styles?: IMyOrdersStyles
  config?: IMyOrdersConfig
  texts?: IMyOrdersTexts
}

export interface IMyOrdersViewProps {
  myEvents: IDropdownItem[]
  selectedEvent?: IDropdownItem
  onChangeEvent: (event: IDropdownItem) => void
  myOrders: IMyOrdersOrder[]
  onSelectOrder: (order: IMyOrdersOrder) => void
  isGettingEventDetails?: boolean
  isLoading?: boolean
  isRefreshing?: boolean
  styles?: IMyOrdersStyles
  onRefresh?: () => void
  config?: IMyOrdersConfig
  onFetchMoreOrders: () => void
  texts?: IMyOrdersTexts

  timeFilters: IDropdownItem[]
  selectedTimeFilter?: IDropdownItem
  onChangeTimeFilter: (event: IDropdownItem) => void
}
