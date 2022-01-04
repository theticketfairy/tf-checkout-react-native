import { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IMyOrdersOrder } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import { IDropdownItem, IDropdownStyles } from '../../components/dropdown/types'
import { IOrderListItemStyles } from './components/types'

export interface IMyOrdersViewProps {
  myEvents: IDropdownItem[]
  selectedEvent?: IDropdownItem
  onChangeEvent: (event: IDropdownItem) => void
  myOrders: IMyOrdersOrder[]
  onSelectOrder: (order: IMyOrdersOrder) => void
  isGettingEventDetails?: boolean
  isLoading?: boolean
  styles?: {
    orderListItem?: IOrderListItemStyles
    safeArea?: StyleProp<ViewStyle>
    listContainer?: StyleProp<ViewStyle>
    eventsContainer?: StyleProp<ViewStyle>
    eventsTitle?: StyleProp<TextStyle>
    refreshControlColor?: ColorValue
    goBackButton?: IButtonStyles
    eventsDropdown?: IDropdownStyles
  }
  goBackButtonText?: string
  onGoBack: () => void
  onRefresh?: () => void
}
