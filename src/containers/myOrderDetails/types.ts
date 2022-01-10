import { IMyOrderDetailsResponse } from '../../api/types'

export interface IMyOrderDetailsProps {
  data: IMyOrderDetailsResponse
  styles?: any
  texts?: any
  onGoBack?: () => void
}

export interface IMyOrderDetailsView extends IMyOrderDetailsProps {
  isLinkCopied?: boolean
  onPressCopyLink: () => void
  onPressTicketDownload: (link: string, hash: string) => void
  isDownloadingTicket?: boolean
}
