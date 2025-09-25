import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  form: {
    width: '100%',
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  sectionContainer: {
    marginVertical: 8,
    width: '100%',
  },
  paymentContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 10,
    minHeight: 180,
  },
  cardContainer: {
    height: 200,
    width: '100%',
  },
  orderReviewContainer: {
    marginVertical: 16,
  },
  // Add-ons styles
  addonSection: {
    marginVertical: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addonInfo: {
    flex: 1,
    marginRight: 16,
  },
  addonName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  addonPriceWithFees: {
    fontSize: 12,
    color: '#666',
  },
  addonDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addonSelectContainer: {
    width: 80,
  },
  addonMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  addonSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },

  cardStyle: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    placeholderColor: '#999999',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
})

export default styles
