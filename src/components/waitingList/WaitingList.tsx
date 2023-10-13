import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Alert } from 'react-native'

import type { IFetchAccessTokenResponse } from '../../api/types'
import { WaitingListCore, type WaitingListCoreHandle } from '../../core'
import type { SessionCoreHandleType } from '../../core/Session/SessionCoreTypes'
import type { IAddToWaitingListCoreParams } from '../../core/WaitingListCore/WaitingListCoreTypes'
import { useDebounced } from '../../helpers/Debounced'
import { validateEmail, validateEmpty } from '../../helpers/Validators'
import type { IWaitingListProps } from './types'
import WaitingListView from './WaitingListView'

const WaitingList = forwardRef<SessionCoreHandleType, IWaitingListProps>(
  (
    {
      styles,
      texts,
      onAddToWaitingListError,
      onAddToWaitingListSuccess,
      onLoadingChange,
      areAlertsEnabled,
    },
    ref
  ) => {
    //#region State
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const firstNameError = useDebounced(firstName, validateEmpty)
    const lastNameError = useDebounced(lastName, validateEmpty)
    const emailError = useDebounced(email, validateEmail)
    //#endregion State

    const handleSetFirstName = (val: string) => setFirstName(val)
    const handleSetLastName = (val: string) => setLastName(val)
    const handleSetEmail = (val: string) => setEmail(val)

    //#region Ref
    const waitingListCoreRef = useRef<WaitingListCoreHandle>(null)
    //#endregion Ref

    const showAlert = (message: string) => {
      if (areAlertsEnabled) {
        Alert.alert('', message)
      }
    }

    //#region Imperative Handler
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken: string
      ): Promise<IFetchAccessTokenResponse> {
        const {
          accessTokenError,
          accessTokenData,
        } = await waitingListCoreRef.current!.refreshAccessToken(refreshToken)

        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {},
    }))
    //#endregion Imperative Handler

    //#region Handlers
    const handleOnPressButton = async () => {
      if (!waitingListCoreRef.current) {
        showAlert('WaitingListCore is not initialized')
        return onAddToWaitingListError?.({
          message: 'WaitingListCore is not initialized',
        })
      }

      const values: IAddToWaitingListCoreParams = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      }

      setIsLoading(true)

      const {
        addToWaitingListData,
        addToWaitingListError,
      } = await waitingListCoreRef.current.addToWaitingList(values)

      setIsLoading(false)
      if (addToWaitingListError) {
        setIsSuccess(false)
        showAlert(addToWaitingListError.message)
        onAddToWaitingListError?.(addToWaitingListError)
        return
      }

      if (addToWaitingListData) {
        onAddToWaitingListSuccess?.()
        setIsSuccess(true)
      }
    }

    const onLoadingChangeCallback = useCallback(
      (loading: boolean) => {
        onLoadingChange?.(loading)
      },
      [onLoadingChange]
    )
    //#endregion Handlers

    useEffect(() => {
      onLoadingChangeCallback(isLoading)
    }, [isLoading, onLoadingChangeCallback])

    //#region RENDER
    return (
      <WaitingListCore ref={waitingListCoreRef}>
        <WaitingListView
          data={{
            firstName: firstName,
            lastName: lastName,
            email: email,
            firstNameError: firstNameError,
            lastNameError: lastNameError,
            emailError: emailError,
            onChangeEmail: handleSetEmail,
            onChangeFirstName: handleSetFirstName,
            onChangeLastName: handleSetLastName,
          }}
          onPressButton={handleOnPressButton}
          isSuccess={isSuccess}
          styles={styles}
          texts={texts}
          isLoading={isLoading}
        />
      </WaitingListCore>
    )
    //#endregion RENDER
  }
)

export default WaitingList
