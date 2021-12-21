import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    height: 50,
    marginBottom: 24,
  },
  dropdownButton: {
    height: 55,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    color: R.colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: R.colors.primary,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: R.colors.primary,
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
    color: R.colors.primary,
  },
})
