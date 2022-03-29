import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  countryContainer: {
    marginRight: 8,
    height: 55,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.white,
    borderRadius: 5,
    zIndex: 3,
  },
  countryButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
  },
  phoneInputContainer: {
    flex: 1,
  },
  modalBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
})
