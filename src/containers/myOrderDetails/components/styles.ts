import { StyleSheet } from 'react-native'

import R from '../../../res'

export const NotificationStyles = StyleSheet.create({
  rootContainer: {
    padding: 24,
    backgroundColor: R.colors.white,
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
    borderRadius: 2,
    elevation: 5,
    shadowColor: R.colors.black,
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: R.colors.black,
  },
  iconSuccess: {
    tintColor: R.colors.validGreen,
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  iconError: {
    tintColor: R.colors.danger,
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
})
