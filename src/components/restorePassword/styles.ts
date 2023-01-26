import { StyleSheet } from 'react-native'

import R from '../../res'

export const restorePasswordStyles = StyleSheet.create({
  rootContainer: {
    paddingVertical: 32,
    width: '80%',
    backgroundColor: R.colors.white,
    borderRadius: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    color: R.colors.black,
    fontSize: 18,
    fontWeight: '800',
  },
})

export const restorePasswordSuccessStyles = StyleSheet.create({
  rootContainer: {
    paddingVertical: 32,
    width: '80%',
    backgroundColor: R.colors.white,
    borderRadius: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    color: R.colors.black,
    fontSize: 18,
    fontWeight: '800',
  },
  message: {
    color: R.colors.black,
  },
})
