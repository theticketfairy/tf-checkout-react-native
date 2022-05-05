import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IMyOrderDetailsTicket } from '../../../../api/types'
import { IButtonStyles } from '../../../../components/button/types'
import { IOnPressTicketDownload } from './TicketListItem'

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
  onPressSellTicket: (ticket: IMyOrderDetailsTicket) => void
  onPressRemoveTicketFromResale: (ticket: IMyOrderDetailsTicket) => void
  onPressTicketDownload: (payload: IOnPressTicketDownload) => void
  isLoading?: boolean
  data: IMyOrderDetailsTicket
  styles?: ITicketListItemStyles
  texts: ITicketListItemTexts
  moreButtonIcon?: ImageSourcePropType
}
