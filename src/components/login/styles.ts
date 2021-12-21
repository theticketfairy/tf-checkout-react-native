import { StyleSheet } from 'react-native'

import R from '../../res'
export default StyleSheet.create({
  rootContainer: {
    paddingVertical: 16,
  },
  title: {
    fontWeight: '800',
  },
  button: {
    marginVertical: 16,
  },
  touchableContainer: {
    flex: 1,
  },
  dismissibleArea: {
    flex: 1,
    backgroundColor: R.colors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    paddingVertical: 32,
    width: '80%',
    backgroundColor: R.colors.white,
    borderRadius: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emailInput: {
    marginBottom: 16,
  },
  loginButton: {
    height: 45,
    width: '100%',
  },
  brand: {
    width: '80%',
    height: 50,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  message: {
    marginBottom: 24,
    marginTop: -8,
  },
})
