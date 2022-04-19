import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import {
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
} from '../../core'
import PurchaseConfirmationView from './PurchaseConfirmationView'
import { IPurchaseConfirmationProps } from './types'

const PurchaseConfirmation: FC<IPurchaseConfirmationProps> = ({
  orderHash,
  onComplete,
  styles,
  texts,
  onFetchPurchaseConfirmationError,
  onFetchPurchaseConfirmationSuccess,
  onLoadingChange,
  areActivityIndicatorsEnabled,
  areAlertsEnabled,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const showAlert = (text: string) => {
    areAlertsEnabled && Alert.alert(text)
  }

  const isPurchaseConfirmationCoreRefReady = (): boolean => {
    if (!purchaseConfirmationCoreRef.current) {
      onFetchPurchaseConfirmationError?.({
        message: 'PurchaseConfirmationCore is not initialized',
      })
      showAlert('PurchaseConfirmationCore is not initialized')
      return false
    }

    return true
  }

  const purchaseConfirmationCoreRef =
    useRef<PurchaseConfirmationCoreHandle>(null)

  const handleOnLoadingChange = useCallback(
    (loading: boolean) => {
      onLoadingChange?.(loading)
    },
    [onLoadingChange]
  )

  useEffect(() => {
    handleOnLoadingChange(isLoading)
  }, [handleOnLoadingChange, isLoading])

  useEffect(() => {
    const getInitialData = async () => {
      if (!isPurchaseConfirmationCoreRefReady()) {
        return
      }

      setIsLoading(true)
      const { purchaseConfirmationError } =
        await purchaseConfirmationCoreRef.current!.getPurchaseConfirmation(
          orderHash
        )
      setIsLoading(false)

      if (purchaseConfirmationError) {
        onFetchPurchaseConfirmationError?.(purchaseConfirmationError)
        return showAlert(purchaseConfirmationError.message)
      }

      onFetchPurchaseConfirmationSuccess?.()
    }

    getInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PurchaseConfirmationCore ref={purchaseConfirmationCoreRef}>
      <PurchaseConfirmationView
        orderHash={orderHash}
        onComplete={onComplete}
        styles={styles}
        texts={texts}
        areActivityIndicatorsEnabled={areActivityIndicatorsEnabled}
      />
    </PurchaseConfirmationCore>
  )
}

export default PurchaseConfirmation
