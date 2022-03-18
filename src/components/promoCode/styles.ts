import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: R.colors.listBackground,
  },
  input: {
    paddingHorizontal: 8,
    minWidth: 100,
    flex: 0.8,
    borderColor: R.colors.black,
    color: R.colors.black,
    height: 45,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: R.colors.primary,
    paddingHorizontal: 8,
    flex: 0.4,
  },
  applyText: {
    fontWeight: '400',
    fontSize: 14,
    color: R.colors.white,
  },
  cancelButton: {
    padding: 4,
    flex: 0.2,
    marginLeft: 4,
  },
  cancelIcon: {
    width: 20,
    height: 20,
    tintColor: R.colors.white,
  },
  errorMessage: {
    color: R.colors.danger,
  },
  validMessage: {
    color: R.colors.validGreen,
  },
  mainButtonContainer: {},
  mainButtonText: {
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: R.colors.white,
  },
  messageContainer: {
    padding: 8,
    backgroundColor: 'gainsboro',
    alignItems: 'center',
  },
  title: {
    marginVertical: 16,
    fontWeight: '600',
  },
})
