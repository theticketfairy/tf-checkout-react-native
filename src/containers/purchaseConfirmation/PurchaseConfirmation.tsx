import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { fetchPurchaseConfirmation } from '../../api/ApiClient'
import PurchaseConfirmationView from './PurchaseConfirmationView'
import { IPurchaseConfirmationProps } from './types'

const PurchaseConfirmation = ({
  orderHash,
  onComplete,
  styles,
  texts,
  onFetchPurchaseConfirmationError,
  onFetchPurchaseConfirmationSuccess,
  onLoadingChange,
  areActivityIndicatorsEnabled,
  areAlertsEnabled,
}: IPurchaseConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const showAlert = (text: string) => {
    areAlertsEnabled && Alert.alert(text)
  }

  const handleOnLoadingChange = useCallback(
    (loading: boolean) => {
      onLoadingChange && onLoadingChange(loading)
    },
    [onLoadingChange]
  )

  useEffect(() => {
    handleOnLoadingChange(isLoading)
  }, [handleOnLoadingChange, isLoading])

  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true)
      const { data: purchaseData, error: purchaseError } =
        await fetchPurchaseConfirmation(orderHash)
      setIsLoading(false)

      if (purchaseError) {
        onFetchPurchaseConfirmationError?.(purchaseError)
        return showAlert(purchaseError.message)
      }

      onFetchPurchaseConfirmationSuccess?.()
    }

    getInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PurchaseConfirmationView
      orderHash={orderHash}
      onComplete={onComplete}
      styles={styles}
      texts={texts}
      areActivityIndicatorsEnabled={areActivityIndicatorsEnabled}
    />
  )
}

export default PurchaseConfirmation
