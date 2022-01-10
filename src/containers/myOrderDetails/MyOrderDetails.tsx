import React, { FC, useState } from 'react'
import {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  downloadFile,
  DownloadFileOptions,
} from 'react-native-fs'

import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import MyOrderDetailsView from './MyOrderDetailsView'
import { IMyOrderDetailsProps } from './types'
const MyOrderDetails: FC<IMyOrderDetailsProps> = ({
  data,
  onGoBack,
  styles,
  texts,
}) => {
  const { header, items, tickets } = data
  console.log('header', header)
  console.log('tickets', tickets)
  console.log('items', items)

  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false)

  const handleOnPressCopyLink = () => {
    setIsLinkCopied(true)
    setTimeout(() => {
      setIsLinkCopied(false)
    }, 3000)
  }

  const handleOnPressTicketDownload = async (link: string, hash: string) => {
    const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
    console.log('handleOnPressTicketDownload - accessToken', accessToken)
    if (!accessToken) {
      return setIsDownloadingTicket(false)
    }

    //Define path to store file along with the extension
    const path = `${DownloadDirectoryPath}/${hash}.pdf`
    const headers = {
      Accept: 'application/pdf',
      'Content-Type': 'application/pdf',
      Authorization: `Bearer ${accessToken}`,
    }
    //Define options
    const options: DownloadFileOptions = {
      fromUrl: link,
      toFile: path,
      headers: headers,
    }
    const response = await downloadFile(options)
    return response.promise.then(async (res) => {
      //Transform response
      if (res && res.statusCode === 200 && res.bytesWritten > 0) {
        setIsDownloadingTicket(false)
      } else {
        setIsDownloadingTicket(false)
      }
    })
  }

  return (
    <MyOrderDetailsView
      data={data}
      styles={styles}
      texts={texts}
      onGoBack={onGoBack}
      isLinkCopied={isLinkCopied}
      onPressCopyLink={handleOnPressCopyLink}
      onPressTicketDownload={handleOnPressTicketDownload}
      isDownloadingTicket={isDownloadingTicket}
    />
  )
}

export default MyOrderDetails
