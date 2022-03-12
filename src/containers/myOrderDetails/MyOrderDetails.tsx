import React, { FC, useCallback, useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  downloadFile,
  DownloadFileOptions,
} from 'react-native-fs'

import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
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
}) => {
  const [isWriteStorageEnabled, setIsWriteStorageEnabled] = useState<
    boolean | undefined
  >(undefined)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<
    DownloadStatus | undefined
  >(undefined)

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
    />
  )
  //#endregion
}

export default MyOrderDetails
