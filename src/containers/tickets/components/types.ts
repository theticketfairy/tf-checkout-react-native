import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IDropdownStyles } from '../../../components/dropdown/types'
import { IInputStyles } from '../../../components/input/types'
import { ISelectedTicket, ITicket } from '../../../types'

export interface ITicketListItemStyles {
  container?: ViewStyle
  ticketName?: TextStyle
  price?: TextStyle
  oldPrice?: TextStyle
  fees?: TextStyle
  soldOutText?: TextStyle
  soldOutContainer?: ViewStyle
  dropdown?: IDropdownStyles
  input?: IInputStyles
  pricesContainer?: StyleProp<ViewStyle>
}

export interface ITicketListItemTexts {
  soldOut?: string
}

export interface ITicketListItemProps extends ITicket {
  ticket: ISelectedTicket
  ticketNumber: number
  onSelectTicketItem: (selectedTicket: ISelectedTicket) => void
  selectedTicket?: ISelectedTicket
  styles?: ITicketListItemStyles
  texts?: ITicketListItemTexts
}
