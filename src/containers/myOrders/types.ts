import { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IMyOrderDetailsResponse, IMyOrdersOrder } from '../../api/types'
import { IDropdownItem, IDropdownStyles } from '../../components/dropdown/types'
import { IOrderListItemStyles } from './components/types'

export interface IMyOrdersStyles {
  orderListItem?: IOrderListItemStyles
  safeArea?: StyleProp<ViewStyle>
  listContainer?: StyleProp<ViewStyle>
  eventsContainer?: StyleProp<ViewStyle>
  eventsTitle?: StyleProp<TextStyle>
  refreshControlColor?: ColorValue
  eventsDropdown?: IDropdownStyles
  rootContainer?: StyleProp<ViewStyle>
}

export interface IMyOrdersProps {
  onSelectOrder: (order: IMyOrderDetailsResponse) => void
  onFetchOrderDetailsFail?: (error: string) => void
  styles?: IMyOrdersStyles
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
}
