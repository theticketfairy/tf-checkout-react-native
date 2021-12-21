import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  content: {
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    minWidth: 100,
    width: '50%',
    borderColor: R.colors.black,
    color: R.colors.black,
  },
  applyButton: {
    backgroundColor: R.colors.primary,
    paddingHorizontal: 8,
  },
  applyButtonDisabled: {
    backgroundColor: R.colors.disabled,
    paddingHorizontal: 8,
  },
  applyText: {
    fontWeight: '400',
    fontSize: 14,
    color: R.colors.white,
  },
  cancelButton: {
    borderColor: 'gray',
  },
  cancelText: {
    fontWeight: '400',
    fontSize: 14,
    color: 'gray',
  },
  mainButtonContainer: {
    marginVertical: 16,
  },
  mainButtonText: {
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: R.colors.white,
  },
  messageContainer: {
    marginVertical: 24,
    padding: 8,
    backgroundColor: 'gainsboro',
    alignItems: 'center',
  },
})
