import {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { IMyOrderDetailsResponse } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'

export interface IMyOrderDetailsProps {
  data: IMyOrderDetailsResponse
  styles?: {
    rootContainer?: StyleProp<ViewStyle>
    header?: {
      container?: StyleProp<ViewStyle>
      title?: StyleProp<TextStyle>
      subTitle?: StyleProp<TextStyle>

      shareLink?: {
        container?: StyleProp<ViewStyle>
        text?: StyleProp<TextStyle>
        copyContainer?: StyleProp<ViewStyle>
        copyText?: StyleProp<TextStyle>
        copyIcon?: StyleProp<ImageStyle>
        copyIconTint?: ColorValue
        copyIconTintActive?: ColorValue
        message?: StyleProp<TextStyle>
        referrals?: StyleProp<TextStyle>
        referralValue?: StyleProp<TextStyle>
      }
    }
    section0Footer?: {
      container?: StyleProp<ViewStyle>
      label?: StyleProp<TextStyle>
      value?: StyleProp<TextStyle>
    }
    sectionHeader?: StyleProp<TextStyle>
    goBackButton?: IButtonStyles

    listItem?: {
      container?: StyleProp<ViewStyle>
      innerLeftContainer?: StyleProp<ViewStyle>
      innerRightContainer?: StyleProp<ViewStyle>
      rowPlaceholder?: StyleProp<TextStyle>
      rowValue?: StyleProp<TextStyle>
    }
    ticketItem?: {
      container?: StyleProp<ViewStyle>
      innerLeftContainer?: StyleProp<ViewStyle>
      innerRightContainer?: StyleProp<ViewStyle>
      rowPlaceholder?: StyleProp<TextStyle>
      rowValue?: StyleProp<TextStyle>
    }
    downloadButton?: IButtonStyles
  }
  texts?: {
    title?: string
    subTitle?: string
    referralLink?: string
    goBackButton?: string
    listItem?: {
      title?: string
      ticketType?: string
      price?: string
      quantity?: string
      total?: string
    }
    ticketItem?: {
      title?: string
      ticketId?: string
      ticketType?: string
      ticketHolder?: string
      status?: string
      download?: string
    }
  }
  onGoBack?: () => void
}

export interface IMyOrderDetailsView extends IMyOrderDetailsProps {
  isLinkCopied?: boolean
  onPressCopyLink: () => void
  onPressTicketDownload: (link: string, hash: string) => void
  isDownloadingTicket?: boolean
}
