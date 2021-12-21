import _map from 'lodash/map'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button, FormField, Loading, Login } from '../../components'
import s from './styles'
import { IBillingInfoViewProps } from './types'

const BillingInfoView = ({
  formFields,
  isLoading,
  onSubmit,
  onLoginSuccessful,
  onLoginFail,
  isDataValid,
  isLoginDialogVisible,
  showLoginDialog,
  hideLoginDialog,
  loginMessage,
  userProfile,
  isSubmitLoading,
  onLogoutSuccess,
  texts,
  styles,
}: IBillingInfoViewProps) => {
  const renderFormFields = useCallback(() => {
    return _map(formFields, (item, index) => (
      <FormField {...item} key={`formField.${index}.${item.id}`} />
    ))
  }, [formFields])

  return (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View style={s.container}>
        <Login
          onLoginSuccessful={onLoginSuccessful}
          onLoginFailure={() => {}}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={showLoginDialog}
          hideLoginDialog={hideLoginDialog}
          message={loginMessage}
          userProfileProp={userProfile}
          onLogoutSuccess={onLogoutSuccess}
          texts={texts?.loginTexts}
          styles={styles?.loginStyles}
        />
        {renderFormFields()}
        <Button
          onPress={onSubmit}
          text={texts?.checkoutButton || 'CHECKOUT'}
          isDisabled={!isDataValid}
          isLoading={isSubmitLoading}
          styles={{
            ...styles?.loginButton,
            container: [s.submitButton, styles?.loginButton?.container],
          }}
        />
        {isLoading && <Loading />}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default BillingInfoView
