import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import type { IMyOrderDetailsTicket } from '../../../../api/types'
import type { IButtonStyles } from '../../../../components/button/types'

export interface ITicketListItemTexts {
  ticketType: string
  holderName: string
  ticketId: string
  status: string
  download: string
  sellTicket: string
  removeTicketFromResale: string
}

export interface ITicketListItemStyles {
  rootContainer?: StyleProp<ViewStyle>
  leftContent?: StyleProp<ViewStyle>
  rightContent?: StyleProp<ViewStyle>
  rowPlaceholder?: StyleProp<TextStyle>
  rowValue?: StyleProp<TextStyle>
  downloadButton?: IButtonStyles
  moreButton?: StyleProp<ViewStyle>
  moreButtonIcon?: StyleProp<ImageStyle>
}

export interface ITicketListItemProps {
  onPressActionsButton: (ticket: IMyOrderDetailsTicket) => void
  data: IMyOrderDetailsTicket
  styles?: ITicketListItemStyles
  texts: ITicketListItemTexts
  moreButtonIcon?: ImageSourcePropType
}
