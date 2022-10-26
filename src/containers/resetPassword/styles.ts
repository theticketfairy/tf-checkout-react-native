import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  dialog: {
    paddingVertical: 32,
    width: '80%',
    backgroundColor: R.colors.white,
    borderRadius: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
})
