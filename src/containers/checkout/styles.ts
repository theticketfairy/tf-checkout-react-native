import { StyleSheet, Platform } from 'react-native'

import R from '../../res'
export default StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: R.colors.primary,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    color: R.colors.primary,
  },
  payButton: {
    width: '100%',
    marginVertical: 24,
    alignSelf: 'center',
  },
  card: {
    marginTop: 24,
    minHeight: Platform.OS === 'ios' ? 180 : 270,
    maxHeight: Platform.OS === 'ios' ? 300 : 350,
    width: '80%',
    borderRadius: 10,
    padding: 8,
    alignSelf: 'center',
    backgroundColor: R.colors.white,
  },
  missingStripeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  missingStripeMessage: {
    fontSize: 16,
    color: R.colors.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardStyle: {
    backgroundColor: R.colors.fff,
  },
})
