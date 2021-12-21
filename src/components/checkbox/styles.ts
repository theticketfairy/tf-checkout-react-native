import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: R.colors.transparent,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorOn: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: R.colors.primary,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    width: '60%',
    height: '60%',
    tintColor: R.colors.white,
  },
  textContainer: {
    flex: 1,
  },
})
