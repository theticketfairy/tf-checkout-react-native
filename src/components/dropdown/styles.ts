import { StyleSheet } from 'react-native'

import R from '../../res'

export const DropdownStyles = StyleSheet.create({
  rootContainer: {
    width: 50,
  },
  button: {
    width: '100%',
    borderWidth: 2,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderColor: R.colors.black,
  },
  icon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    tintColor: R.colors.black,
  },
  label: {
    color: R.colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalBackgroundTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: R.colors.white,
    paddingVertical: 16,
    minWidth: '40%',
    maxWidth: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '40%',
  },
})

export const DropdownListItemStyles = StyleSheet.create({
  rootContainer: {
    paddingVertical: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    minHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.white,
    paddingHorizontal: 8,
  },
  buttonSelected: {
    width: '100%',
    minHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.tint,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: R.colors.black,
  },
})
