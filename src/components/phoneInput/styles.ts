import { Platform, StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  countryContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    width: Platform.OS === 'ios' ? 32 : 16,
  },
  countryButton: {
    width: Platform.OS === 'ios' ? 32 : 32,
    overflow: 'hidden',
    marginBottom: -8,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: R.colors.transparent,
    zIndex: 4,
  },
  phoneInputContainer: {
    flex: 1,
  },
  textInput: {
    width: 0,
    borderBottomWidth: 0,
  },
})
