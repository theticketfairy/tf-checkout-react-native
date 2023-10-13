import { Dimensions, StyleSheet } from 'react-native'

import R from '../../res'

const { width: screenWidth } = Dimensions.get('window')



export default StyleSheet.create({
  rootContainer: {
    backgroundColor: R.colors.transparentBlack,
    flex: 1,
    justifyContent: 'flex-end',
  },
  animatedContent: {
    width: screenWidth,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingVertical: 24,
    backgroundColor: R.colors.listBackground,
  },
  closeButton: {
    padding: 8,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
  },
  closeButtonIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: R.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
})
