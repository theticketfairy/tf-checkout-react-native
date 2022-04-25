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
import { IError } from '../../types'
import { INotificationIcons } from './components/Notification'

export interface IMyOrdersDetailsConfig {
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
}

export interface IMyOrderDetailsProps {
  data: IMyOrderDetailsData

  // Used to navigate to the Resale Tickets screen
  onPressResaleTicket: (
    ticket: IMyOrderDetailsTicket,
    isTicketTypeActive: boolean
  ) => void

  onRemoveTicketFromResaleSuccess: (message: string) => void
  onRemoveTicketFromResaleError?: (error: IError) => void

  config?: IMyOrdersDetailsConfig
  onDownloadStatusChange?: (status?: DownloadStatus) => void
  downloadStatusIcons?: INotificationIcons
  onAndroidWritePermission?: (permission?: boolean) => void
  onLinkCopied?: (copied?: boolean) => void

  styles?: IMyOrderDetailsStyles
  texts?: IMyOrderDetailsTexts
}

export type DownloadStatus = 'downloading' | 'downloaded' | 'failed'

export interface IMyOrderDetailsViewProps {
  data: IMyOrderDetailsData

  config?: IMyOrdersDetailsConfig

  isLinkCopied?: boolean
  onPressCopyLink: () => void
  onPressTicketDownload: (link: string, hash: string) => void

  // Used to navigate to the Resale Tickets screen
  onPressResaleTicket: (ticket: IMyOrderDetailsTicket) => void
  onPressRemoveTicketFromResale: (ticket: IMyOrderDetailsTicket) => void

  downloadStatus?: DownloadStatus
  isLoading: boolean

  downloadStatusIcons?: INotificationIcons

  styles?: IMyOrderDetailsStyles
  texts?: IMyOrderDetailsTexts
}

export interface IOrderDetailsSectionData {
  id: string
  item: IMyOrderDetailsItem
}

export interface IOrderDetailsSectionTickets {
  id: string
  item: IMyOrderDetailsTicket
}

export interface IMyOrderDetailsTexts {
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

export interface IMyOrderDetailsStyles {
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
