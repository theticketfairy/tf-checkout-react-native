import { StyleSheet } from 'react-native'

import R from '../../res'

const FONT_SIZE = 16

export default StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 12,
    color: R.colors.primary,
    marginBottom: 4,
    fontWeight: '400',
  },
  button: {
    width: '100%',
    borderWidth: 1,
    height: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderColor: '#bdbdbd',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: FONT_SIZE,
    paddingVertical: 8,
    color: '#000000',
  },
  error: {
    color: R.colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
})
