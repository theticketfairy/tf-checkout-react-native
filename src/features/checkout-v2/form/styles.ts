import { CardFormView } from '@stripe/stripe-react-native';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import type { FormikFieldComponentStyles } from '../../form';

const baseStyles = StyleSheet.create({
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
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addonItem: {
    flexDirection: 'column',
    gap: 16,
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
  ticketHolderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
});

export interface CheckoutFormStyles {
  form?: StyleProp<ViewStyle>;
  sectionTitle?: StyleProp<TextStyle>;
  sectionContainer?: StyleProp<ViewStyle>;
  paymentContainer?: StyleProp<ViewStyle>;
  cardContainer?: StyleProp<ViewStyle>;
  orderReviewContainer?: StyleProp<ViewStyle>;
  orderReviewItem?: {
    container?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
    subtitle?: StyleProp<TextStyle>;
    value?: StyleProp<TextStyle>;
  };
  addonRow?: StyleProp<ViewStyle>;
  addonSection?: StyleProp<ViewStyle>;
  addonItem?: StyleProp<ViewStyle>;
  addonInfo?: StyleProp<ViewStyle>;
  addonName?: StyleProp<TextStyle>;
  addonPrice?: StyleProp<TextStyle>;
  addonPriceWithFees?: StyleProp<TextStyle>;
  addonDescription?: StyleProp<TextStyle>;
  addonSelectContainer?: StyleProp<ViewStyle>;
  addonMainTitle?: StyleProp<TextStyle>;
  addonSubtitle?: StyleProp<TextStyle>;
  button?: StyleProp<ViewStyle>;
  buttonDisabled?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
  errorContainer?: StyleProp<ViewStyle>;
  errorText?: StyleProp<TextStyle>;
  paymentContainerInner?: StyleProp<ViewStyle>;
  cardStyle?: Partial<CardFormView.Styles>;
  ticketHolderTitle?: StyleProp<TextStyle>;
  fields?: FormikFieldComponentStyles;
}

export type CheckoutFormComputedStyles = ReturnType<
  typeof mergeCheckoutFormStyles
>;

export const cardStyle: CardFormView.Styles = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  placeholderColor: '#999999',
  borderWidth: 1,
  borderColor: '#E0E0E0',
  borderRadius: 8,
};

export const mergeCheckoutFormStyles = (overrides?: CheckoutFormStyles) => ({
  form: StyleSheet.flatten([baseStyles.form, overrides?.form]),
  sectionTitle: StyleSheet.flatten([
    baseStyles.sectionTitle,
    overrides?.sectionTitle,
  ]),
  sectionContainer: StyleSheet.flatten([
    baseStyles.sectionContainer,
    overrides?.sectionContainer,
  ]),
  paymentContainer: StyleSheet.flatten([
    baseStyles.paymentContainer,
    overrides?.paymentContainer,
  ]),
  cardContainer: StyleSheet.flatten([
    baseStyles.cardContainer,
    overrides?.cardContainer,
  ]),
  orderReviewContainer: StyleSheet.flatten([
    baseStyles.orderReviewContainer,
    overrides?.orderReviewContainer,
  ]),
  orderReviewItem: overrides?.orderReviewItem,
  addonSection: StyleSheet.flatten([
    baseStyles.addonSection,
    overrides?.addonSection,
  ]),
  addonRow: StyleSheet.flatten([baseStyles.addonRow, overrides?.addonRow]),
  addonItem: StyleSheet.flatten([baseStyles.addonItem, overrides?.addonItem]),
  addonInfo: StyleSheet.flatten([baseStyles.addonInfo, overrides?.addonInfo]),
  addonName: StyleSheet.flatten([baseStyles.addonName, overrides?.addonName]),
  addonPrice: StyleSheet.flatten([
    baseStyles.addonPrice,
    overrides?.addonPrice,
  ]),
  addonPriceWithFees: StyleSheet.flatten([
    baseStyles.addonPriceWithFees,
    overrides?.addonPriceWithFees,
  ]),
  addonDescription: StyleSheet.flatten([
    baseStyles.addonDescription,
    overrides?.addonDescription,
  ]),
  addonSelectContainer: StyleSheet.flatten([
    baseStyles.addonSelectContainer,
    overrides?.addonSelectContainer,
  ]),
  addonMainTitle: StyleSheet.flatten([
    baseStyles.addonMainTitle,
    overrides?.addonMainTitle,
  ]),
  addonSubtitle: StyleSheet.flatten([
    baseStyles.addonSubtitle,
    overrides?.addonSubtitle,
  ]),
  button: StyleSheet.flatten([baseStyles.button, overrides?.button]),
  buttonDisabled: StyleSheet.flatten([
    baseStyles.buttonDisabled,
    overrides?.buttonDisabled,
  ]),
  buttonText: StyleSheet.flatten([
    baseStyles.buttonText,
    overrides?.buttonText,
  ]),
  errorContainer: StyleSheet.flatten([
    baseStyles.errorContainer,
    overrides?.errorContainer,
  ]),
  errorText: StyleSheet.flatten([baseStyles.errorText, overrides?.errorText]),
  paymentContainerInner: StyleSheet.flatten([overrides?.paymentContainerInner]),
  cardStyle: {
    ...cardStyle,
    ...(overrides?.cardStyle || {}),
  },
  ticketHolderTitle: StyleSheet.flatten([
    baseStyles.ticketHolderTitle,
    overrides?.ticketHolderTitle,
  ]),
  fields: overrides?.fields,
});

export default baseStyles;
