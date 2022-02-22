import { StyleSheet } from 'react-native'

import R from '../../res'

const RADIO_SIZE = 20
const RADIO_RADIUS = RADIO_SIZE / 2
const INDICATOR_SIZE = RADIO_SIZE * 0.6
const INDICATOR_RADIUS = INDICATOR_SIZE / 2

export default StyleSheet.create({
  rootContainer: {
    marginVertical: 4,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  radio: {
    height: RADIO_SIZE,
    width: RADIO_SIZE,
    borderRadius: RADIO_RADIUS,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_RADIUS,
    backgroundColor: R.colors.black,
  },
})
