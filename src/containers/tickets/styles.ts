import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 22,
    color: R.colors.primary,
    fontWeight: '800',
  },
  headerTextBold: {
    fontSize: 18,
    fontWeight: '800',
    color: R.colors.primary,
  },
  configContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
})
