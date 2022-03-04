import React, { useEffect } from 'react'

import { fetchPurchaseConfirmation } from '../../api/ApiClient'
import PurchaseConfirmationView from './PurchaseConfirmationView'
import { IPurchaseConfirmationProps } from './types'

const PurchaseConfirmation = ({
  orderHash,
  onComplete,
  styles,
  texts,
}: IPurchaseConfirmationProps) => {
  useEffect(() => {
    const getInitialData = async () => {
      const { data: purchaseData, error: purchaseError } =
        await fetchPurchaseConfirmation(orderHash)

      console.log('purchaseData', purchaseData)
      console.log('purchaseError', purchaseError)
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
    />
  )
}

export default PurchaseConfirmation
