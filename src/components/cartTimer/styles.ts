import { Dimensions, StyleSheet } from 'react-native'

import R from '../../res'

const { width: sWidth } = Dimensions.get('window')

export default StyleSheet.create({
  rootContainer: {
    backgroundColor: R.colors.timerBackground,
    position: 'absolute',
    right: 0,
    top: 40,
    width: sWidth / 1.5,
    borderRadius: 2,
    padding: 8,
    elevation: 3,
    shadowOffset: { width: -3, height: 3 },
    shadowColor: R.colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  rootContainerSmall: {
    width: sWidth / 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  textsContainer: { flex: 1 },
  message: { marginBottom: 4 },
  time: {
    fontWeight: '800',
  },
  timeOnlyVisible: {
    alignSelf: 'center',
  },
})
