import _forEach from 'lodash/forEach'
import React, { FC, useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  downloadFile,
  DownloadFileOptions,
} from 'react-native-fs'

import { IMyOrderDetailsResponse, IMyOrderDetailsTicket } from '../..'
import { removeTicketFromResale } from '../../api/ApiClient'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import MyOrderDetailsView from './MyOrderDetailsView'
import { DownloadStatus, IMyOrderDetailsProps } from './types'

const MyOrderDetails: FC<IMyOrderDetailsProps> = ({
  data,
  styles,
  texts,
  onPressSellTicket,
}) => {
  const [isWriteStorageEnabled, setIsWriteStorageEnabled] = useState<
    boolean | undefined
  >(undefined)
  const [orderInfo, setOrderInfo] = useState<IMyOrderDetailsResponse>(data)
  const [isLoading, setIsLoading] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<
    DownloadStatus | undefined
  >(undefined)

  const handleOnPressCopyLink = () => {
    setIsLinkCopied(true)
    setTimeout(() => {
      setIsLinkCopied(false)
    }, 3000)
  }

  const handleOnPressTicketDownload = async (link: string, hash: string) => {
    const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
    if (!accessToken) {
      return setDownloadStatus(undefined)
    }

    //Define path to store file along with the extension
    const path =
      Platform.OS === 'ios'
        ? `${DocumentDirectoryPath}/${hash}.pdf`
        : `${DownloadDirectoryPath}/${hash}.pdf`

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
    setDownloadStatus('downloading')
    const response = await downloadFile(options).promise

    if (response.statusCode === 200) {
      setDownloadStatus('downloaded')
    } else {
      setDownloadStatus('failed')
    }

    setTimeout(() => {
      setDownloadStatus(undefined)
    }, 5000)
  }

  const handleWithdrawTicket = async (ticket: IMyOrderDetailsTicket) => {
    setIsLoading(true)
    const { removeTicketFromResaleData, removeTicketFromResaleError } =
      await removeTicketFromResale(ticket.hash)
    setIsLoading(false)

    if (removeTicketFromResaleError || !removeTicketFromResaleData) {
      return Alert.alert('', removeTicketFromResaleError)
    }

    const updatedOrderInfo = { ...orderInfo }
    _forEach(updatedOrderInfo.tickets, (item) => {
      if (item.hash === ticket.hash) {
        item.isSellable = true
        item.isOnSale = false
      }
    })
    setOrderInfo(updatedOrderInfo)
  }

  const handleOnPressResaleTicket = (ticket: IMyOrderDetailsTicket) => {
    if (ticket.isOnSale) {
      return Alert.alert(
        'Withdraw ticket confirmation',
        'Are you sure you want to withdraw your ticket from resale?',
        [
          {
            text: 'No',
          },
          {
            text: 'Yes, withdraw',
            onPress: () => handleWithdrawTicket(ticket),
          },
        ]
      )
    }

    return onPressSellTicket(ticket)
  }

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return
    }

    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ).then((result) => {
      setIsWriteStorageEnabled(result)
    })
  }, [])

  useEffect(() => {
    if (isWriteStorageEnabled === false && Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ).then((result) => {
        setIsWriteStorageEnabled(result === 'granted')
      })
    }
  }, [isWriteStorageEnabled])

  return (
    <MyOrderDetailsView
      data={orderInfo}
      styles={styles}
      texts={texts}
      isLinkCopied={isLinkCopied}
      onPressCopyLink={handleOnPressCopyLink}
      onPressTicketDownload={handleOnPressTicketDownload}
      downloadStatus={downloadStatus}
      onPressSellTicket={handleOnPressResaleTicket}
      isLoading={isLoading}
    />
  )
}

export default MyOrderDetails
