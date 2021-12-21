import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.primary,
    height: 45,
    width: '100%',
    paddingHorizontal: 8,
  },
  buttonDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.disabled,
    height: 45,
    width: '100%',
  },
  text: {
    color: R.colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
})
