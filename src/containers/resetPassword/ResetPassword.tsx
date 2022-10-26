import React, { FC, useState } from 'react'

import { useDebounced } from '../../helpers/Debounced'
import { validatePasswords } from '../../helpers/Validators'
import ResetPasswordView from './ResetPasswordView'
import { IResetPasswordProps } from './types'

const ResetPassword: FC<IResetPasswordProps> = ({
  styles,
  texts,
  onPressCancelButton,
  onPressResetButton,
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const newPasswordError = useDebounced(newPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const confirmNewPasswordError = useDebounced(confirmNewPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const handleOnPressResetButton = () => {
    onPressResetButton({
      password: newPassword,
      confirmPassword: confirmNewPassword,
    })
  }

  const handleOnPressCancelButton = () => {}

  return <ResetPasswordView />
}

export default ResetPassword
