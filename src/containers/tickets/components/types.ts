import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IDropdownStyles } from '../../../components/dropdown/types'
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
  pricesContainer?: StyleProp<ViewStyle>
}

export interface ITicketListItemTexts {
  soldOut?: string
  salesNotStarted?: string
  salesEnded?: string
  inclFees?: string
  exclFees?: string
  free?: string
  ticket?: string
}

export interface ITicketListItemProps extends ITicket {
  ticket: ISelectedTicket
  ticketNumber: number
  onSelectTicketItem: (selectedTicket: ISelectedTicket) => void
  selectedTicket?: ISelectedTicket
  styles?: ITicketListItemStyles
  texts?: ITicketListItemTexts
}
