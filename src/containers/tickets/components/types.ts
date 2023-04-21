import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

import type { IDropdownStyles } from '../../../components/dropdown/types'
import type { ISelectedTicket, ITicket } from '../../../types'

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

//#region TicketGroupListHeader
export interface ITicketGroupListHeaderStyles {
  container?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
}

export interface ITicketGroupListHeaderProps {
  styles?: ITicketGroupListHeaderStyles
  text?: string
}
//#endregion
