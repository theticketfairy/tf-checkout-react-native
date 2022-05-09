import _find from 'lodash/find'
import _forEach from 'lodash/forEach'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  downloadFile,
  DownloadFileOptions,
} from 'react-native-fs'

import { IMyOrderDetailsData, IMyOrderDetailsTicket } from '../../api/types'
import { OrderDetailsCore } from '../../core'
import OrderDetailsCoreHandle from '../../core/OrderDetailsCore/OrderDetailsCoreTypes'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import { IOnPressTicketDownload } from './components/TicketListItem/TicketListItem'
import MyOrderDetailsView from './MyOrderDetailsView'
import { DownloadStatus, IMyOrderDetailsProps } from './types'

const MyOrderDetails: FC<IMyOrderDetailsProps> = ({
  data,
  styles,
  texts,
  config,
  onDownloadStatusChange,
  downloadStatusIcons,
  onAndroidWritePermission,
  onLinkCopied,
  onPressResaleTicket,

  onRemoveTicketFromResaleSuccess,
  onRemoveTicketFromResaleError,
  moreButtonIcon,
}) => {
  const [isWriteStorageEnabled, setIsWriteStorageEnabled] = useState<
    boolean | undefined
  >(undefined)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<
    DownloadStatus | undefined
  >(undefined)
  const [orderInfo, setOrderInfo] = useState<IMyOrderDetailsData>(data)
  const [isLoading, setIsLoading] = useState(false)

  //#region refs
  const myOrderDetailsCoreRef = useRef<OrderDetailsCoreHandle>(null)
  //#endregion

  //#region Handlers
  const handleOnDownloadStatusChange = useCallback(
    (status?: DownloadStatus) => {
      onDownloadStatusChange?.(status)
    },
    [onDownloadStatusChange]
  )

  const handleOnPressCopyLink = () => {
    setIsLinkCopied(true)
    onLinkCopied?.(true)
    setTimeout(() => {
      setIsLinkCopied(false)
      onLinkCopied?.(false)
    }, 3000)
  }

  const handleOnPressTicketDownload = async ({
    hash,
    pdfLink,
  }: IOnPressTicketDownload) => {
    const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
    if (!accessToken) {
      return setDownloadStatus(undefined)
    }
    if (!pdfLink) {
      return setDownloadStatus('failed')
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
      fromUrl: pdfLink,
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

  const handleRemoveTicketFromResale = async (
    ticket: IMyOrderDetailsTicket
  ) => {
    if (!myOrderDetailsCoreRef.current) {
      return Alert.alert('MyOrderDetailsCoreRef is not initialized')
    }

    setIsLoading(true)
    const { removeTicketFromResaleData, removeTicketFromResaleError } =
      await myOrderDetailsCoreRef.current.removeTicketFromResale(ticket.hash)
    setIsLoading(false)

    if (removeTicketFromResaleError || !removeTicketFromResaleData) {
      onRemoveTicketFromResaleError?.(removeTicketFromResaleError!)
      return Alert.alert('', removeTicketFromResaleError?.message)
    }

    const updatedOrderInfo = { ...orderInfo }
    _forEach(updatedOrderInfo.tickets, (item) => {
      if (item.hash === ticket.hash) {
        item.isSellable = true
        item.isOnSale = false
      }
    })

    Alert.alert('', removeTicketFromResaleData.message)

    setOrderInfo(updatedOrderInfo)
    onRemoveTicketFromResaleSuccess?.(removeTicketFromResaleData.message)
  }

  const askToRemoveTicketFromResale = (ticket: IMyOrderDetailsTicket) => {
    Alert.alert(
      'Withdraw ticket confirmation',
      'Are you sure you want to withdraw your ticket from resale?',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes, withdraw',
          onPress: () => handleRemoveTicketFromResale(ticket),
        },
      ]
    )
  }

  const handleOnPressResaleTicket = (ticket: IMyOrderDetailsTicket) => {
    const activeTicketType = _find(
      data.items,
      (ticketType) => ticketType.hash === ticket.ticketTypeHash
    )

    return onPressResaleTicket(ticket, activeTicketType!.isActive)
  }
  //#endregion

  //#region Effects
  useEffect(() => {
    handleOnDownloadStatusChange(downloadStatus)
  }, [downloadStatus, handleOnDownloadStatusChange])

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
    if (Platform.OS === 'android') {
      onAndroidWritePermission?.(isWriteStorageEnabled)
    }

    if (isWriteStorageEnabled === false && Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ).then((result) => {
        setIsWriteStorageEnabled(result === 'granted')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWriteStorageEnabled])
  //#endregion

  //#region Render
  return (
    <OrderDetailsCore ref={myOrderDetailsCoreRef}>
      <MyOrderDetailsView
        data={data}
        styles={styles}
        texts={texts}
        isLinkCopied={isLinkCopied}
        onPressCopyLink={handleOnPressCopyLink}
        onPressTicketDownload={handleOnPressTicketDownload}
        downloadStatus={downloadStatus}
        config={config}
        downloadStatusIcons={downloadStatusIcons}
        onPressResaleTicket={handleOnPressResaleTicket}
        onPressRemoveTicketFromResale={askToRemoveTicketFromResale}
        isLoading={isLoading}
        moreButtonIcon={moreButtonIcon}
      />
    </OrderDetailsCore>
  )
  //#endregion
}

export default MyOrderDetails
