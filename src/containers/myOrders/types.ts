import {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IMyOrderDetailsResponse, IMyOrdersOrder } from '../../api/types'
import { IDropdownItem, IDropdownStyles } from '../../components/dropdown/types'
import { IError } from '../../types'
import { IOrderListItemStyles } from './components/types'

export interface IMyOrdersConfig {
  isEventsDropdownHidden?: boolean
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
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
}

export interface IMyOrdersTexts {
  selectEventPlaceholder?: string
  title?: string
}

export interface IMyOrdersProps {
  onSelectOrder: (order: IMyOrderDetailsResponse) => void

  onFetchMyOrdersSuccess?: () => void
  onFetchMyOrdersError?: (error: IError) => void

  onFetchOrderDetailsSuccess?: () => void
  onFetchOrderDetailsError?: (error: IError) => void

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
  styles?: IMyOrdersStyles
  onRefresh?: () => void
  config?: IMyOrdersConfig
  onFetchMoreOrders: () => void
  texts?: IMyOrdersTexts
}
