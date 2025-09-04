import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  cardForm: {
    height: 300,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabledButton: {
    opacity: 0.6,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentReadyContainer: {
    padding: 16,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  paymentReadyText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
})
