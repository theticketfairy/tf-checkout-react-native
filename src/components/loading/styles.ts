import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: R.colors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: R.colors.black,
    marginTop: 16,
    fontSize: 18,
  },
  content: {
    backgroundColor: R.colors.white,
    padding: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0,
    },
  },
})
