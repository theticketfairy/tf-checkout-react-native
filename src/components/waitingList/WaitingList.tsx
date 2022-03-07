import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { addToWaitingList } from '../../api/ApiClient'
import { useDebounced } from '../../helpers/Debounced'
import { validateEmail, validateEmpty } from '../../helpers/Validators'
import { IWaitingListFields, IWaitingListProps } from './types'
import WaitingListView from './WaitingListView'

const WaitingList = ({
  styles,
  texts,
  eventId,
  onAddToWaitingListError,
  onAddToWaitingListSuccess,
  onLoadingChange,
  areAlertsEnabled,
}: IWaitingListProps) => {
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const firstNameError = useDebounced(firstName, validateEmpty)
  const lastNameError = useDebounced(lastName, validateEmpty)
  const emailError = useDebounced(email, validateEmail)

  const handleSetFirstName = (val: string) => setFirstName(val)
  const handleSetLastName = (val: string) => setLastName(val)
  const handleSetEmail = (val: string) => setEmail(val)

  const handleOnPressButton = async () => {
    const values: IWaitingListFields = {
      ticketTypeId: '',
      quantity: '',
      firstName: firstName,
      lastName: lastName,
      email: email,
    }

    setIsLoading(true)

    const { addToWaitingListData, addToWaitingListError } =
      await addToWaitingList(eventId, values)

    setIsLoading(false)
    if (addToWaitingListError) {
      setIsSuccess(false)
      if (areAlertsEnabled) {
        Alert.alert('', addToWaitingListError.message)
      }

      if (onAddToWaitingListError) {
        onAddToWaitingListError(addToWaitingListError)
      }
      return
    }

    if (addToWaitingListData) {
      if (onAddToWaitingListSuccess) {
        onAddToWaitingListSuccess()
      }
      setIsSuccess(true)
    }
  }

  const onLoadingChangeCallback = useCallback(
    (loading: boolean) => {
      if (onLoadingChange) {
        onLoadingChange(loading)
      }
    },
    [onLoadingChange]
  )

  useEffect(() => {
    onLoadingChangeCallback(isLoading)
  }, [isLoading, onLoadingChangeCallback])

  return (
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
  )
}

export default WaitingList
