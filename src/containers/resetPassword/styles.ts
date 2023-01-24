import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  pressable: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  contentContainer: {
    paddingVertical: 32,
    width: '80%',
    backgroundColor: R.colors.white,
    borderRadius: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dialogTitle: {
    color: R.colors.black,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  resetButtonContainer: {
    marginBottom: 16,
  },
  apiError: {
    color: R.colors.danger,
    marginBottom: 16,
  },
})
