import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: R.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 32,
  },
  errorText: {
    color: R.colors.danger,
  },
})
