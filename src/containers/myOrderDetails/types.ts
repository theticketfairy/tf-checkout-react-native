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
        link?: StyleProp<TextStyle>
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
}

export type DownloadStatus = 'downloading' | 'downloaded' | 'failed'

export interface IMyOrderDetailsView extends IMyOrderDetailsProps {
  isLinkCopied?: boolean
  onPressCopyLink: () => void
  onPressTicketDownload: (link: string, hash: string) => void
  downloadStatus?: DownloadStatus
}
