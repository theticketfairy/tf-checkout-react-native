import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  // Main container - similar to BillingInfo
  rootContainer: {
    marginHorizontal: 24,
    marginBottom: 50,
    flex: 1,
  },
  // Form elements
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginVertical: 32,
  },
  submitButtonDisabled: {
    marginVertical: 32,
  },
  // Titles and text
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 24,
  },
  emailAdvice: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  // Add-ons section
  addonSection: {
    marginBottom: 24,
  },
  addonMainTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  addonSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  addonInfo: {
    flex: 1,
    marginRight: 16,
  },
  addonName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  addonPrice: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  addonPriceWithFees: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 4,
  },
  addonDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  addonSelectContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  // Card styles
  card: {
    marginTop: 24,
    minHeight: Platform.OS === 'ios' ? 180 : 270,
    maxHeight: Platform.OS === 'ios' ? 300 : 350,
    width: '80%',
    borderRadius: 10,
    padding: 8,
    alignSelf: 'center',
  },
  cardStyle: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
})

export default styles
