import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 50,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginVertical: 32,
  },
  submitButtonDisabled: {
    marginVertical: 32,
    backgroundColor: R.colors.disabled,
  },
  customCheckboxText: {
    paddingRight: 32,
  },
  privacyPolicyLink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },

  skippingRootContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  skippingDialogContainer: {
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 5,
    elevation: 4,
    shadowColor: R.colors.black,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  skippingBrandImage: {
    height: 90,
    width: 250,
    resizeMode: 'contain',
    tintColor: R.colors.black,
  },
  skippingMessage: {
    fontSize: 20,
    color: R.colors.black,
    fontWeight: '700',
    marginBottom: 24,
  },
  ttfPolicyError: {
    color: R.colors.danger,
    marginTop: 8,
  },
})
