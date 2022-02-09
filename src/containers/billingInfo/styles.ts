import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 50,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginVertical: 32,
  },
  submitButtonDisabled: {
    marginVertical: 32,
    backgroundColor: R.colors.disabled,
  },
  customCheckboxText: {
    paddingRight: 32,
  },
  privacyPolicyLink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
})
