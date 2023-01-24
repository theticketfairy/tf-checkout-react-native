import { StyleSheet } from 'react-native'

import R from '../../res'

const LEFT_ICON_SIZE = 22
const TEXT_LEFT_MARGIN = LEFT_ICON_SIZE + 10
const FONT_SIZE = 16

export default StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textLabelFocused: {
    color: R.colors.primary,
    fontSize: 14,
  },
  textLabelFocusedError: {
    color: R.colors.danger,
    fontSize: 14,
  },
  textLabel: {
    color: R.colors.primary,
    fontSize: FONT_SIZE,
  },
  textValue: {
    color: R.colors.white,
    fontSize: FONT_SIZE,
    marginLeft: TEXT_LEFT_MARGIN,
    marginBottom: -2,
  },
  textValueWithoutIcon: {
    color: R.colors.white,
    fontSize: FONT_SIZE,
    marginLeft: 0,
    marginBottom: -2,
  },
  fieldWrapper: {
    flex: 1,
  },
  error: {
    color: R.colors.danger,
    fontSize: 14,
    marginTop: -4,
  },
  showPasswordIcon: {
    tintColor: 'black',
    width: 24,
    height: 24,
  },
})
