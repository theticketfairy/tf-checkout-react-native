import { CardForm, CardFormView } from '@stripe/stripe-react-native';
import { FormikProvider, useFormik } from 'formik';
import React, {
  ComponentRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  findNodeHandle,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import { Loading } from '../../../components';
import { logger } from '../../../utils/Logger';
import { readableError } from '../../../utils/handlers';
import { FormikField } from '../../form';
import { FieldType } from '../../form/types';
import AddonsContainer from '../components/AddonsContainer';
import Conditions from '../components/Conditions';
import OrderReview, { IOrderItem } from '../components/OrderReview';
import { createCheckoutFormConfig, formFieldsOrder } from './config';
import { CheckoutFormComputedStyles, mergeCheckoutFormStyles } from './styles';
import { mergeCheckoutFormTexts } from './texts';
import {
  CheckoutFormOrderSummaryTexts,
  CheckoutFormPaymentTexts,
  CheckoutFormProps,
  CheckoutFormTexts,
  PaymentFormProps,
} from './types';
import { getFieldType } from '../utils';

const MemoizedAddonsContainer = React.memo(AddonsContainer);
const MemoizedConditions = React.memo(Conditions);
const MemoizedOrderReview = React.memo(OrderReview);

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  initialValues,
  isSubmitting,
  isLoggedIn,
  isAgeRequired = false,
  minimumAge,
  isTicketFree = false,
  isPhoneRequired = false,
  isPhoneHidden = false,
  countries,
  states,
  onCountryChange,
  orderItems,
  availableAddons = [],
  onAddonChange,
  onSubmit: onSubmitCallback,
  scrollRef,
  isInitialLoading,
  eventCurrency,
  conditions,
  isSinglePageCheckout = true,
  orderCustomFields = [],
  ticketCustomFields = [],
  addonCustomFields = [],
  styles: stylesProp,
  texts: textsProp,
}) => {
  // Handle card form state for payment
  const [isCardFormComplete, setIsCardFormComplete] = useState(false);
  const [cardFormError, setCardFormError] = useState<string>();

  const styles = useMemo<CheckoutFormComputedStyles>(
    () => mergeCheckoutFormStyles(stylesProp),
    [stylesProp]
  );

  const texts = useMemo<Required<CheckoutFormTexts>>(
    () => mergeCheckoutFormTexts(textsProp),
    [textsProp]
  );

  const fieldComponentStyles = styles.fields;

  const addonsStyles = useMemo(
    () => ({
      container: styles.addonSection,
      title: styles.sectionTitle,
      addonItem: styles.addonItem,
      addonInfo: styles.addonInfo,
      addonName: styles.addonName,
      addonRow: styles.addonRow,
      addonPrice: styles.addonPrice,
      addonPriceWithFees: styles.addonPriceWithFees,
      addonDescription: styles.addonDescription,
      addonSelectContainer: styles.addonSelectContainer,
      fieldComponentStyles,
    }),
    [fieldComponentStyles, styles]
  );

  // Initial values already include default custom field values from the hook
  const modifiedInitialValues = {
    ...initialValues,
    isCardFormComplete: isTicketFree ? true : initialValues.isCardFormComplete,
  };
  const requiredConditions = useMemo(
    () => conditions?.filter((c) => c.is_required) || [],
    [conditions]
  );

  const formik = useFormik({
    initialValues: modifiedInitialValues,
    onSubmit: onSubmitCallback,
    validationSchema: createCheckoutFormConfig({
      minimumAge,
      isAgeRequired,
      requirePassword: !isLoggedIn,
      isTicketFree,
      isSinglePageCheckout,
      requiredConditions,
      isPhoneRequired,
      orderCustomFields,
      ticketCustomFields,
    }),
    validateOnChange: true,
    enableReinitialize: true,
  });
  const fieldTopRef = useRef<Record<string, number>>({});

  // Helper: scroll to a field by key using onLayout-captured positions
  const scrollToField = (key: string, attempt: number = 0) => {
    if (key === 'isCardFormComplete' || !scrollRef.current) return;

    let y = fieldTopRef.current[key];

    // Fallback for nested ticket holder fields
    if (
      !(typeof y === 'number' && Number.isFinite(y)) &&
      key.startsWith('ticketHolders[')
    ) {
      const holderMatch = key.match(/^ticketHolders\[(\d+)\]/);
      const index = holderMatch ? holderMatch[1] : undefined;
      if (index != null) {
        const holderKey = `ticketHolders[${index}]`;
        y = fieldTopRef.current[holderKey];
        if (!(typeof y === 'number' && Number.isFinite(y))) {
          y = fieldTopRef.current.ticketHolders;
        }
      }
    }

    if (typeof y === 'number' && Number.isFinite(y)) {
      try {
        scrollRef.current.scrollTo({ y: Math.max(0, y - 16), animated: true });
        logger.debug('[CheckoutForm] Scrolled to field', { key, position: y });
      } catch (e) {
        logger.debug('[CheckoutForm] scrollTo failed', { key, error: e instanceof Error ? e.message : String(e) });
      }
    } else if (attempt < 3) {
      setTimeout(() => scrollToField(key, attempt + 1), 50);
    } else {
      logger.warn('[CheckoutForm] Could not scroll to field - position not found', { key });
    }
  };

  const onPressSubmit = async () => {
    logger.debug('[CheckoutForm] Form submission initiated');
    const allFields = Object.keys(initialValues);

    // Create touched fields with special handling for nested ticket holders
    const touchedFields = allFields.reduce(
      (acc, field) => {
        // Handle ticketHolders specially as a nested structure
        if (field === 'ticketHolders') {
          // Create a properly structured touched fields object for ticket holders
          acc[field] = formik.values.ticketHolders.map(() => ({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }));
        } else {
          // Mark all other fields as touched
          acc[field] = true;
        }
        return acc;
      },
      {} as Record<string, boolean | Record<string, boolean>[]>
    );

    const result = await formik.setTouched(touchedFields, true);
    const formErrors = typeof result === 'object' ? result : {};
    const paymentValid =
      isCardFormComplete || isTicketFree || !isSinglePageCheckout;
    logger.debug('[CheckoutForm] submitting', { paymentValid, isCardFormComplete, isTicketFree, isSinglePageCheckout });

    if (!paymentValid) {
      setCardFormError(texts.payment.errorRequired);
    }

    if (Object.keys(formErrors).length === 0 && paymentValid) {
      logger.debug('[CheckoutForm] Form validation passed, submitting', { email: formik.values.email });
      formik.handleSubmit();
      return;
    }
    logger.warn('[CheckoutForm] Form validation failed', { errors: Object.keys(formErrors), paymentValid });

    const firstErroredKey = formFieldsOrder.find(
      (k) => (formErrors as any)[k as keyof typeof formErrors] != null
    );

    if (firstErroredKey === 'ticketHolders') {
      const thErrors = (formErrors as any).ticketHolders as Array<any>;
      if (Array.isArray(thErrors)) {
        const erroredIndex = thErrors.findIndex(
          (e) => e && Object.keys(e).length > 0
        );
        if (erroredIndex >= 0) {
          scrollToField(`ticketHolders[${erroredIndex}]`);
          logger.debug('[CheckoutForm] Scrolling to errored ticket holder', { index: erroredIndex });
          return;
        }
      }
      scrollToField('ticketHolders');
    } else if (firstErroredKey) {
      scrollToField(firstErroredKey);
    } else if (!paymentValid) {
      scrollToField('isCardFormComplete');
    }
  };

  const handleAddonChange = useCallback(
    (addonId: string, quantity: number) => {
      formik.setFieldValue(`addons.${addonId}.quantity`, quantity);
      if (quantity > 0) {
        // reapply defaults if coming from 0
        addonCustomFields.forEach((field) => {
          if (field.defaultValue != null) {
            formik.setFieldValue(
              `addons.${addonId}.customFields.${field.name}`,
              Array.isArray(field.defaultValue)
                ? field.defaultValue.join(',')
                : field.defaultValue
            );
          }
        });
      }
      onAddonChange?.(addonId, quantity);
    },
    [formik, onAddonChange]
  );
  return (
    <FormikProvider value={formik}>
      {isInitialLoading && <Loading />}
      <View style={styles.form} collapsable={false}>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.firstName = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'firstName',
              type: FieldType.INPUT,
              label: texts.form.firstName,
              placeholder: texts.form.firstNamePlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.lastName = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'lastName',
              type: FieldType.INPUT,
              label: texts.form.lastName,
              placeholder: texts.form.lastNamePlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) => (fieldTopRef.current.email = e.nativeEvent.layout.y)}
        >
          <FormikField
            field={{
              name: 'email',
              type: FieldType.INPUT,
              label: texts.form.email,
              placeholder: texts.form.emailPlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.emailConfirmation = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'emailConfirmation',
              type: FieldType.INPUT,
              label: texts.form.emailConfirmation,
              placeholder: texts.form.emailConfirmationPlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.password = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'password',
              type: FieldType.INPUT,
              label: texts.form.password,
              placeholder: texts.form.passwordPlaceholder,
              hide: isLoggedIn,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.passwordConfirmation = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'passwordConfirmation',
              type: FieldType.INPUT,
              label: texts.form.passwordConfirmation,
              placeholder: texts.form.passwordConfirmationPlaceholder,
              hide: isLoggedIn,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) => (fieldTopRef.current.phone = e.nativeEvent.layout.y)}
        >
          <FormikField
            field={{
              name: 'phone',
              type: FieldType.PHONE,
              label: texts.form.phone,
              placeholder: texts.form.phonePlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) => (fieldTopRef.current.phone = e.nativeEvent.layout.y)}
        >
          <FormikField
            field={{
              name: 'dateOfBirth',
              type: FieldType.DATE_PICKER,
              label: texts.form.dateOfBirth,
              placeholder: texts.form.dateOfBirthPlaceholder,
              hide: !isAgeRequired,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.dateOfBirth = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'street',
              type: FieldType.INPUT,
              label: texts.form.street,
              placeholder: texts.form.streetPlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.street = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'city',
              type: FieldType.INPUT,
              label: texts.form.city,
              placeholder: texts.form.cityPlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.country = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'country',
              type: FieldType.SELECT,
              label: texts.form.country,
              options: countries.map((c) => ({
                value: String(c.id),
                label: c.name,
              })),
              onChange: (val) => {
                onCountryChange(val);
              },
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.country = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'state',
              type: FieldType.SELECT,
              label: texts.form.state,
              options: states,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          onLayout={(e) =>
            (fieldTopRef.current.postalCode = e.nativeEvent.layout.y)
          }
        >
          <FormikField
            field={{
              name: 'postalCode',
              type: FieldType.INPUT,
              label: texts.form.postalCode,
              placeholder: texts.form.postalCodePlaceholder,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        {orderCustomFields.map((field) => (
          <View
            key={field.name}
            onLayout={(e) =>
              (fieldTopRef.current[field.name] = e.nativeEvent.layout.y)
            }
          >
            <FormikField
              field={{
                name: `customFields.${field.name}`,
                type: getFieldType(field.type),
                label:
                  texts.form.customFields?.[field.name]?.label ?? field.label,
                placeholder:
                  texts.form.customFields?.[field.name]?.placeholder ??
                  (field.description || `Enter ${field.label}`),
                options: field.options?.map((option) => ({
                  value: option.value,
                  label: option.name,
                })),
              }}
              styles={fieldComponentStyles}
            />
          </View>
        ))}
        <View>
          <FormikField
            field={{
              name: 'isSubToTicketFairy',
              type: FieldType.CHECKBOX,
              label: texts.marketingOptIns.ticketFairyOptIn,
            }}
            styles={fieldComponentStyles}
          />
          <FormikField
            field={{
              name: 'isSubToBrand',
              type: FieldType.CHECKBOX,
              label: texts.marketingOptIns.organizerOptIn,
            }}
            styles={fieldComponentStyles}
          />
        </View>
        <View
          collapsable={false}
          onLayout={(e) => {
            fieldTopRef.current.ticketHolders = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>{texts.ticketHolders.title}</Text>

          {formik.values.ticketHolders.map((_, index) => {
            const ticketLabel = (
              texts.ticketHolders.itemTitle || 'Ticket {index}'
            ).replace('{index}', String(index + 1));

            return (
              <View
                key={index}
                collapsable={false}
                onLayout={(e) => {
                  const sectionY = fieldTopRef.current.ticketHolders ?? 0;
                  const holderY = sectionY + e.nativeEvent.layout.y;
                  fieldTopRef.current[`ticketHolders[${index}]`] = holderY;
                }}
              >
                <Text style={styles.ticketHolderTitle}>{ticketLabel}</Text>

                <View
                  collapsable={false}
                  onLayout={(e) => {
                    const baseY =
                      fieldTopRef.current[`ticketHolders[${index}]`] ??
                      fieldTopRef.current.ticketHolders ??
                      0;
                    fieldTopRef.current[`ticketHolders[${index}].firstName`] =
                      baseY + e.nativeEvent.layout.y;
                  }}
                >
                  <FormikField
                    field={{
                      name: `ticketHolders[${index}].firstName`,
                      type: FieldType.INPUT,
                      label: texts.ticketHolders.firstName,
                      placeholder: texts.ticketHolders.firstNamePlaceholder,
                    }}
                    styles={fieldComponentStyles}
                  />
                </View>

                <View
                  collapsable={false}
                  onLayout={(e) => {
                    const baseY =
                      fieldTopRef.current[`ticketHolders[${index}]`] ??
                      fieldTopRef.current.ticketHolders ??
                      0;
                    fieldTopRef.current[`ticketHolders[${index}].lastName`] =
                      baseY + e.nativeEvent.layout.y;
                  }}
                >
                  <FormikField
                    field={{
                      name: `ticketHolders[${index}].lastName`,
                      type: FieldType.INPUT,
                      label: texts.ticketHolders.lastName,
                      placeholder: texts.ticketHolders.lastNamePlaceholder,
                    }}
                    styles={fieldComponentStyles}
                  />
                </View>

                <View
                  collapsable={false}
                  onLayout={(e) => {
                    const baseY =
                      fieldTopRef.current[`ticketHolders[${index}]`] ??
                      fieldTopRef.current.ticketHolders ??
                      0;
                    fieldTopRef.current[`ticketHolders[${index}].email`] =
                      baseY + e.nativeEvent.layout.y;
                  }}
                >
                  <FormikField
                    field={{
                      name: `ticketHolders[${index}].email`,
                      type: FieldType.INPUT,
                      label: texts.ticketHolders.email,
                      placeholder: texts.ticketHolders.emailPlaceholder,
                    }}
                    styles={fieldComponentStyles}
                  />
                </View>

                <View
                  collapsable={false}
                  onLayout={(e) => {
                    const baseY =
                      fieldTopRef.current[`ticketHolders[${index}]`] ??
                      fieldTopRef.current.ticketHolders ??
                      0;
                    fieldTopRef.current[`ticketHolders[${index}].phone`] =
                      baseY + e.nativeEvent.layout.y;
                  }}
                >
                  <FormikField
                    field={{
                      name: `ticketHolders[${index}].phone`,
                      type: FieldType.PHONE,
                      label: texts.ticketHolders.phone,
                      placeholder: texts.ticketHolders.phonePlaceholder,
                      hide: isPhoneHidden,
                    }}
                    styles={fieldComponentStyles}
                  />

                  {/* Ticket custom fields */}
                  {ticketCustomFields.map((field) => (
                    <FormikField
                      key={`${index}-${field.name}`}
                      field={{
                        name: `ticketHolders[${index}].customFields.${field.name}`,
                        type: getFieldType(field.type),
                        label:
                          texts.ticketHolders.customFields?.[field.name]
                            ?.label ?? field.label,
                        required: field.required,
                        placeholder:
                          texts.ticketHolders.customFields?.[field.name]
                            ?.placeholder ??
                          (field.description || `Enter ${field.label}`),
                        options: field.options?.map((option) => ({
                          value: option.value,
                          label: option.name,
                        })),
                      }}
                      styles={fieldComponentStyles}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.sectionContainer}>
          <MemoizedAddonsContainer
            addonCustomFields={addonCustomFields}
            addons={formik.values.addons}
            availableAddons={availableAddons || []}
            onAddonChange={handleAddonChange}
            currency={eventCurrency}
            styles={addonsStyles}
            texts={{
              title: texts.addons.title,
              quantityLabel: texts.addons.quantityLabel,
              priceWithFeesSuffix: texts.addons.priceWithFeesSuffix,
            }}
          />
        </View>
        {/* Event Conditions */}
        {conditions && conditions.length > 0 && (
          <View style={styles.sectionContainer}>
            <MemoizedConditions
              conditions={conditions}
              acceptedConditions={formik.values.acceptedConditions}
              onAcceptCondition={(conditionId, isAccepted) => {
                formik.setFieldValue('acceptedConditions', {
                  ...formik.values.acceptedConditions,
                  [conditionId]: isAccepted,
                });
              }}
              texts={{
                title: texts.conditions.title,
                viewButton: texts.conditions.viewButton,
                hideButton: texts.conditions.hideButton,
                acceptCheckbox: texts.conditions.acceptLabel,
              }}
            />
          </View>
        )}

        {/* Payment - only show in single-page mode and if ticket is not free */}
        {!isTicketFree && isSinglePageCheckout && (
          <View
            style={styles.sectionContainer}
            onLayout={(e) =>
              (fieldTopRef.current.isCardFormComplete = e.nativeEvent.layout.y)
            }
          >
            <Payment
              orderItems={orderItems}
              onFormComplete={(details) => {
                logger.debug('[CheckoutForm] Payment form complete', { ...details });
                setIsCardFormComplete(details.complete);
              }}
              error={cardFormError}
              styles={styles}
              texts={{
                orderSummary: texts.orderSummary,
                payment: texts.payment,
              }}
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isSubmitting ? styles.buttonDisabled : {}]}
          onPress={onPressSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSinglePageCheckout
                ? texts.buttons.singlePageSubmit
                : texts.buttons.goToPayment}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </FormikProvider>
  );
};

interface PaymentProps {
  onFormComplete: (details: CardFormView.Details) => void;
  error?: string;
  orderItems: IOrderItem[];
  paymentViewProps?: ViewProps;
  styles: CheckoutFormComputedStyles;
  texts: {
    orderSummary: CheckoutFormOrderSummaryTexts;
    payment: CheckoutFormPaymentTexts;
  };
}

export const Payment = ({
  onFormComplete,
  error,
  orderItems,
  paymentViewProps,
  styles,
  texts,
}: PaymentProps) => {
  return (
    <View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {texts.orderSummary.sectionTitle}
        </Text>
        <MemoizedOrderReview
          orderItems={orderItems}
          styles={{
            rootContainer: styles.orderReviewContainer,
            item: styles.orderReviewItem,
          }}
        />
      </View>

      <View style={styles.sectionContainer} {...paymentViewProps}>
        <Text style={styles.sectionTitle}>{texts.payment.sectionTitle}</Text>
        <View style={styles.paymentContainer}>
          <CardForm
            onFormComplete={onFormComplete}
            style={styles.cardContainer}
            cardStyle={styles.cardStyle}
            dangerouslyGetFullCardDetails={true}
            autofocus={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </View>
  );
};

export const PaymentForm = ({
  orderItems,
  onSubmit,
  styles: stylesProp,
  texts: textsProp,
}: PaymentFormProps) => {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCardFormComplete, setIsCardFormComplete] = useState(false);

  const styles = useMemo<CheckoutFormComputedStyles>(
    () => mergeCheckoutFormStyles(stylesProp),
    [stylesProp]
  );

  const texts = useMemo<Required<CheckoutFormTexts>>(
    () => mergeCheckoutFormTexts(textsProp),
    [textsProp]
  );

  const onFormComplete = (details: CardFormView.Details) => {
    logger.debug('[PaymentForm] CardForm onFormComplete triggered', { 
      complete: details.complete,
      details: JSON.stringify(details)
    });
    setIsCardFormComplete(details.complete);

    if (details.complete) {
      setError(undefined);
      logger.debug('[PaymentForm] Card form marked as complete');
    } else {
      logger.debug('[PaymentForm] Card form incomplete');
    }
  };

  const onPressSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Don't validate isCardFormComplete here - onFormComplete doesn't trigger on Android v40+
      // Let Stripe's confirmPayment handle validation instead
      logger.debug('[PaymentForm] Submitting payment', { isCardFormComplete });
      
      await onSubmit();
    } catch (e) {
      const errorMsg = readableError(e);
      logger.error('[PaymentForm] Payment submission failed', { error: errorMsg });
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <Payment
        orderItems={orderItems}
        onFormComplete={onFormComplete}
        error={error}
        paymentViewProps={{}}
        styles={styles}
        texts={{
          orderSummary: texts.orderSummary,
          payment: texts.payment,
        }}
      />
      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isSubmitting ? styles.buttonDisabled : {}]}
        onPress={onPressSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>{texts.buttons.paymentSubmit}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
