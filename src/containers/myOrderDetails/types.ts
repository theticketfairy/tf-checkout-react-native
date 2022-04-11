import {
  ColorValue,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import {
  IMyOrderDetailsData,
  IMyOrderDetailsItem,
  IMyOrderDetailsTicket,
} from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import { INotificationIcons } from './components/Notification'

export interface IMyOrdersDetailsConfig {
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
}

export interface IMyOrderDetailsProps {
  data: IMyOrderDetailsData
  config?: IMyOrdersDetailsConfig
  onDownloadStatusChange?: (status?: DownloadStatus) => void
  downloadStatusIcons?: INotificationIcons
  onAndroidWritePermission?: (permission?: boolean) => void
  onLinkCopied?: (copied?: boolean) => void
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
    referral?: {
      soFar?: string
      tickets?: string
    }
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
    downloadNotification?: {
      successMessage?: string
      errorMessage?: string
    }
    copyText?: {
      copy?: string
      copied?: string
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

export interface IOrderDetailsSectionData {
  id: string
  item: IMyOrderDetailsItem
}

export interface IOrderDetailsSectionTickets {
  id: string
  item: IMyOrderDetailsTicket
}
