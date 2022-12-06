import React, { FC, useRef, useState } from 'react'

import { ResetPasswordCore, ResetPasswordCoreHandle } from '../../core'
import { useDebounced } from '../../helpers/Debounced'
import { validatePasswords } from '../../helpers/Validators'
import ResetPasswordView from './ResetPasswordView'
import { IResetPasswordProps } from './types'

const ResetPassword: FC<IResetPasswordProps> = ({
  token,
  styles,
  texts,
  onResetPasswordError,
  onResetPasswordSuccess,
  onPressCancelButton,
  onPressResetButton,
}) => {
  //#region State
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  //#endregion State

  const resetPasswordCoreRef = useRef<ResetPasswordCoreHandle>(null)

  const newPasswordError = useDebounced(newPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const confirmNewPasswordError = useDebounced(confirmNewPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const isDataValid = (): boolean => {
    if (!newPassword) {
      return false
    }

    if (!confirmNewPassword) {
      return false
    }

    if (newPassword !== confirmNewPassword) {
      return false
    }

    return true
  }

  //#region Handlers
  const handleOnPressResetPasswordButton = async () => {
    if (!resetPasswordCoreRef.current) {
      return
    }

    onPressResetButton?.()

    if (!isDataValid()) {
      return
    }

    setIsLoading(true)
    const response = await resetPasswordCoreRef.current.postResetPassword({
      token: token,
      password: newPassword,
      password_confirmation: confirmNewPassword,
    })
    setIsLoading(false)

    console.log('response', response)

    if (response.error) {
      setApiError(response.error.message)
      return onResetPasswordError?.(response.error)
    }

    setApiSuccess(response.data!.message)
    return onResetPasswordSuccess?.(response.data!)
  }

  const handleOnPressCancelButton = () => {
    onPressCancelButton?.()
  }
  //#endregion Handlers

  //#region Return
  return (
    <ResetPasswordCore ref={resetPasswordCoreRef}>
      <ResetPasswordView
        onChangePassword={setNewPassword}
        onChangePasswordConfirm={setConfirmNewPassword}
        password={newPassword}
        passwordConfirm={confirmNewPassword}
        onPressResetButton={handleOnPressResetPasswordButton}
        onPressCancelButton={handleOnPressCancelButton}
        passwordError={newPasswordError}
        passwordConfirmError={confirmNewPasswordError}
        styles={styles}
        texts={texts}
        isDataValid={isDataValid()}
        apiError={apiError}
        isLoading={isLoading}
        apiSuccess={apiSuccess}
      />
    </ResetPasswordCore>
  )
  //#endregion Return
}

export default ResetPassword
