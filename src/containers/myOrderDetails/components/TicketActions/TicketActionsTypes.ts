import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import type { IMyOrderDetailsTicket } from '../../../../api/types'

export type TicketActionType =
  | 'download-pdf'
  | 'sell'
  | 'remove-from-sale'
  | 'refund'

export interface ITicketActionIcons {
  downloadPdf?: ImageSourcePropType
  sell?: ImageSourcePropType
  removeFromSale?: ImageSourcePropType
  refund?: ImageSourcePropType
}

export interface ITicketActionTexts {
  downloadPdf?: string
  sell?: string
  removeFromSale?: string
  refund?: string
}

export interface ITicketActionsStyles {
  rootScrollViewContainer?: StyleProp<ViewStyle>
  buttonContainer?: StyleProp<ViewStyle>
  buttonContent?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  text?: StyleProp<TextStyle>
}

export interface ITicketActionsProps {
  onSelectAction: (action: TicketActionType) => void
  ticket: IMyOrderDetailsTicket
  icons?: ITicketActionIcons
  texts?: ITicketActionTexts
  styles?: ITicketActionsStyles
}
