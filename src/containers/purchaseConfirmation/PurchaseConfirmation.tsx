import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Alert } from 'react-native'

import { IFetchAccessTokenResponse } from '../../api/types'
import {
  PurchaseConfirmationCore,
  PurchaseConfirmationCoreHandle,
  SessionHandle,
} from '../../core'
import { SessionHandleType } from '../../core/Session/SessionCoreTypes'
import PurchaseConfirmationView from './PurchaseConfirmationView'
import { IPurchaseConfirmationProps } from './types'

const PurchaseConfirmation = forwardRef<
  SessionHandleType,
  IPurchaseConfirmationProps
>(
  (
    {
      orderHash,
      onComplete,
      styles,
      texts,
      onFetchPurchaseConfirmationError,
      onFetchPurchaseConfirmationSuccess,
      onLoadingChange,
      areActivityIndicatorsEnabled,
      areAlertsEnabled,
    },
    ref
  ) => {
    //#region State
    const [isLoading, setIsLoading] = useState(false)
    //#endregion State

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

    //#region Fetch data
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
    //#endregion Fetch data

    //#region Ref
    const purchaseConfirmationCoreRef =
      useRef<PurchaseConfirmationCoreHandle>(null)
    const sessionHandleRef = useRef<SessionHandleType>(null)
    //#endregion Ref

    const handleOnLoadingChange = useCallback(
      (loading: boolean) => {
        onLoadingChange?.(loading)
      },
      [onLoadingChange]
    )

    //#region Imperative Handler
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken: string
      ): Promise<IFetchAccessTokenResponse> {
        if (!sessionHandleRef.current) {
          return {
            accessTokenError: {
              message: 'Session Handle ref is not initialized',
            },
          }
        }

        const { accessTokenError, accessTokenData } =
          await sessionHandleRef.current!.refreshAccessToken(refreshToken)
        if (!accessTokenError && accessTokenData?.accessToken) {
          await getInitialData()
        }
        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {
        await getInitialData()
      },
    }))
    //#endregion Imperative Handler

    //#region useEffect
    useEffect(() => {
      handleOnLoadingChange(isLoading)
    }, [handleOnLoadingChange, isLoading])

    useEffect(() => {
      getInitialData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //#endregion useEffect

    //#region RENDER
    return (
      <PurchaseConfirmationCore ref={purchaseConfirmationCoreRef}>
        <SessionHandle ref={sessionHandleRef}>
          <PurchaseConfirmationView
            orderHash={orderHash}
            onComplete={onComplete}
            styles={styles}
            texts={texts}
            areActivityIndicatorsEnabled={areActivityIndicatorsEnabled}
          />
        </SessionHandle>
      </PurchaseConfirmationCore>
    )
    //#endregion RENDER
  }
)

export default PurchaseConfirmation
