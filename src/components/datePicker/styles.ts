import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  button: {
    width: '100%',
    borderWidth: 1,
    height: 55,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderColor: R.colors.primary,
    borderRadius: 5,
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    color: R.colors.primary,
  },
})
