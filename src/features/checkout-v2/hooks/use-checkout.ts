/*
 * COMPOSITE HOOK FOR CHECKOUT FLOW
 *
 * This hook is used to initialize the checkout flow
 * and provide all the necessary data and functions
 * to the checkout component.
 *
 */

import {
  BillingDetails,
  initStripe,
  useConfirmPayment,
  createPaymentMethod,
} from '@stripe/stripe-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';

import { logger } from '../../../utils/Logger';
import { logError } from '../../../utils/handlers';
import { useRegisterUser } from '../../auth/api-hooks';
import {
  CustomerProfileResponse,
  IRegisterUserResponse,
} from '../../auth/types';
import { storeAuthTokens } from '../../auth/utils';
import { useEventCustomFields } from '../../event/api-hooks';
import {
  AddOnAttribute,
  OrderAttribute,
  TicketAttribute,
} from '../../event/types';
import { useCountries, useStates } from '../../geo/api-hooks';
import { CheckoutFormProps, CheckoutFormValues } from '../form/types';
import { IOrderItem, OrderResult, UpdateCheckoutResponse } from '../types';
import {
  createCheckoutBody,
  createRegistrationData,
  priceWithCurrency,
} from '../utils';
import {
  useAddons,
  useCart,
  useCheckout,
  useEventConditions,
  useEventInfo,
  usePaymentData,
  usePaymentSuccess,
  useTickets,
  useUpdateCheckout,
} from './api-hooks';

export interface UseCheckoutFlowProps {
  onCartExpired?: () => void;
  isSinglePageCheckout?: boolean;
  isAgeRequired?: boolean;
  isPhoneRequired?: boolean;
  isPhoneHidden?: boolean;
  minimumAge?: number;
  customerProfile?: CustomerProfileResponse;
  onCheckoutSuccess?: (data: ICheckoutSuccessData) => void;
  onCheckoutError?: (error: any) => void;
  onPaymentSuccess?: (data: OrderResult) => void;
  onPaymentError?: (error: any) => void;
  //   Return true if the form should be submitted
  onRegistrationSuccess?: (data: IRegisterUserResponse) => void;
  onRegistrationError?: (error: any) => void;
}

export interface UseCheckoutFlowReturn
  extends Omit<CheckoutFormProps, 'scrollRef'> {
  secondsLeft: number | undefined;
  eventId: string | undefined;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  isLoggedIn: boolean;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  checkoutData: UpdateCheckoutResponse | null;
  handlePayment: (input: ICheckoutSuccessData) => Promise<void>;
}

export interface ICheckoutSuccessData {
  hash: string;
  total: string | number;
  values: CheckoutFormValues;
}

export const useCheckoutFlow = ({
  onCartExpired,
  onCheckoutSuccess,
  onCheckoutError,
  onPaymentSuccess,
  onPaymentError,
  isAgeRequired,
  isPhoneRequired,
  isPhoneHidden,
  minimumAge,
  isSinglePageCheckout,
  customerProfile,
  onRegistrationSuccess,
  onRegistrationError,
}: UseCheckoutFlowProps): UseCheckoutFlowReturn => {
  const cartQuery = useCart();
  const eventId = cartQuery.data?.data?.attributes?.eventId;

  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutData, setCheckoutData] = useState<UpdateCheckoutResponse | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<string>('1');
  const [addons, setAddons] = useState<Record<string, number>>({});

  const ticketsQuery = useTickets(eventId);
  const eventInfoQuery = useEventInfo(eventId);

  const countriesQuery = useCountries();

  const checkoutMutation = useCheckout();
  const paymentDataMutation = usePaymentData();
  const updateCheckoutMutation = useUpdateCheckout();
  const paymentSuccessMutation = usePaymentSuccess();
  const customFieldsQuery = useEventCustomFields(eventId);

  const addonsQuery = useAddons(eventId);
  const statesQuery = useStates(selectedCountry);
  const conditionsQuery = useEventConditions(eventId);

  const handleRegistrationError = useCallback(
    (registerError: any): boolean => {
      // Check for already registered user (422 status)
      if (registerError?.response?.status === 422) {
        const errorData = registerError.response?.data;

        // Check all possible email error structures
        const emailErrors =
          errorData?.errors?.email ||
          errorData?.data?.message?.email ||
          (errorData?.message?.email ? errorData.message.email : null);

        logger.debug('[useCheckoutFlow] Email validation error:', { emailErrors });
        if (emailErrors) {
          // Show login dialog for already registered user
          const emailAlreadyRegisteredText =
            'It appears this email is already attached to an account. Please log in here to complete your registration.';

          let errorMessage: string;
          if (Array.isArray(emailErrors)) {
            errorMessage = emailErrors[0];
          } else if (typeof emailErrors === 'string') {
            errorMessage = emailErrors;
          } else {
            errorMessage = emailAlreadyRegisteredText;
          }

          if (errorMessage === 'The email is already used') {
            errorMessage = emailAlreadyRegisteredText;
          }

          // Show login dialog
          onRegistrationError?.(errorMessage);
          return true; // Registration handled, don't continue with checkout
        } else {
          // Other validation errors
          const errorMessages = Object.entries(errorData?.errors || {})
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(', ') : messages
                }`
            )
            .join('\n');
          throw new Error(`Validation errors: ${errorMessages}`);
        }
      }

      // Generic error
      throw new Error(registerError?.message || 'Registration failed');
    },
    [onRegistrationError]
  );

  const registerUserMutation = useRegisterUser();

  const registerUser = useCallback(
    async (values: CheckoutFormValues): Promise<boolean> => {
      try {
        // User is already registered or logged in, skip registration
        if (customerProfile) {
          logger.debug('[useCheckoutFlow] User already logged in, skipping registration');
          return true;
        }
        logger.debug('[useCheckoutFlow] Starting user registration', { email: values.email });
        // Create and submit registration data
        const registerUserData = createRegistrationData(values, isAgeRequired);
        const result = await registerUserMutation.mutateAsync(registerUserData);

        // Store tokens and extract user data
        await storeAuthTokens(result.data.attributes);

        logger.debug('[useCheckoutFlow] User registration successful', { email: values.email });
        // Registration successful
        onRegistrationSuccess?.(result.data);
        return true;
      } catch (registerError: any) {
        logger.error('[useCheckoutFlow] User registration failed', { error: registerError?.message, email: values.email });
        return !handleRegistrationError(registerError);
      }
    },
    [
      customerProfile,
      isAgeRequired,
      registerUserMutation,
      handleRegistrationError,
      onRegistrationSuccess,
    ]
  );

  // Extract and sort order custom fields
  const orderCustomFields = useMemo(() => {
    if (!customFieldsQuery.data?.data?.attributes) {
      return [];
    }

    // Filter for order attributes only
    const orderAttributes = customFieldsQuery.data.data.attributes.filter(
      (attr): attr is OrderAttribute => 'order' in attr
    );

    // Extract fields from order attributes and sort by order property
    const fields = orderAttributes
      .map((attr) => attr.order.group.fields)
      .flat()
      .sort((a, b) => {
        // Convert order strings to numbers for comparison
        const orderA = parseInt(a.order, 10) || 0;
        const orderB = parseInt(b.order, 10) || 0;
        return orderA - orderB;
      });

    return fields;
  }, [customFieldsQuery.data]);

  // Extract and sort ticket custom fields
  const ticketCustomFields = useMemo(() => {
    if (!customFieldsQuery.data?.data?.attributes) {
      return [];
    }

    // Filter for ticket attributes only
    const ticketAttributes = customFieldsQuery.data.data.attributes.filter(
      (attr) => 'ticket' in attr
    ) as TicketAttribute[];

    // Extract fields from ticket attributes and sort by order property
    const fields = ticketAttributes
      .map((attr) => attr.ticket.group.fields)
      .flat()
      .sort((a, b) => {
        // Convert order strings to numbers for comparison
        const orderA = parseInt(a.order, 10) || 0;
        const orderB = parseInt(b.order, 10) || 0;
        return orderA - orderB;
      });

    return fields;
  }, [customFieldsQuery.data]);

  const addonCustomFields = useMemo(() => {
    if (!customFieldsQuery.data?.data?.attributes) {
      return [];
    }

    // Filter for addon attributes only
    const addonAttributes = customFieldsQuery.data.data.attributes.filter(
      (attr) => 'add-on' in attr
    ) as AddOnAttribute[];

    // Extract fields from addon attributes and sort by order property
    const fields = addonAttributes
      .map((attr) => attr['add-on'].group.fields)
      .flat()
      .sort((a, b) => {
        // Convert order strings to numbers for comparison
        const orderA = parseInt(a.order, 10) || 0;
        const orderB = parseInt(b.order, 10) || 0;
        return orderA - orderB;
      });

    return fields;
  }, [customFieldsQuery.data]);

  const { confirmPayment } = useConfirmPayment();

  const isInitialLoading = useMemo(() => {
    if (cartQuery.isPending) return true;
    if (eventInfoQuery.isPending) return true;
    if (ticketsQuery.isPending) return true;
    if (countriesQuery.isPending) return true;
    if (customFieldsQuery.isPending) return true;

    return false;
  }, [
    cartQuery.isPending,
    eventInfoQuery.isPending,
    ticketsQuery.isPending,
    countriesQuery.isPending,
    customFieldsQuery.isPending,
  ]);

  const defaultCustomFieldValues = useMemo(() => {
    const orderDefaults: Record<string, string | string[]> = {};
    const ticketDefaults: Record<string, string | string[]> = {};
    const addonDefaults: Record<string, string | string[]> = {};

    // Get the custom fields from the query response
    if (customFieldsQuery.data?.data?.attributes) {
      // Filter to only include OrderAttribute types and cast accordingly
      const orderAttributes = customFieldsQuery.data.data.attributes.filter(
        (attr): attr is OrderAttribute => 'order' in attr
      );

      const ticketAttributes = customFieldsQuery.data.data.attributes.filter(
        (attr): attr is TicketAttribute => 'ticket' in attr
      );

      const addonAttributes = customFieldsQuery.data.data.attributes.filter(
        (attr): attr is AddOnAttribute => 'add-on' in attr
      );
      // Extract fields from order attributes - now TypeScript knows these are OrderAttribute
      const orderFields = orderAttributes
        .map((attr) => attr.order.group.fields)
        .flat();
      // Set default values for fields that have them
      orderFields.forEach((field) => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          orderDefaults[field.name] = field.defaultValue;
        }
      });

      // Extract fields from ticket attributes - now TypeScript knows these are TicketAttribute
      const ticketFields = ticketAttributes
        .map((attr) => attr.ticket.group.fields)
        .flat();

      ticketFields.forEach((field) => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          ticketDefaults[field.name] = field.defaultValue;
        }
      });

      // Extract fields from addon attributes - now TypeScript knows these are AddOnAttribute
      const addonFields = addonAttributes
        .map((attr) => attr['add-on'].group.fields)
        .flat();

      addonFields.forEach((field) => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          addonDefaults[field.name] = field.defaultValue;
        }
      });
    }

    return { orderDefaults, ticketDefaults, addonDefaults };
  }, [customFieldsQuery.data]);

  // Prefill form with user profile data when available
  const initialValues = useMemo(() => {
    // Get ticket quantity from cart
    const ticketQuantity =
      cartQuery.data?.data?.attributes?.cart?.[0]?.quantity || 1;
    // Create empty ticket holders array based on ticket quantity
    const ticketHolders = Array.from({ length: ticketQuantity }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      customFields: { ...defaultCustomFieldValues.ticketDefaults }, // Apply default values for ticket custom fields
    }));

    const availableAddons = addonsQuery.data?.data?.attributes?.add_ons || [];

    // build addon defaults
    const addonDefaults: CheckoutFormValues['addons'] = {};

    availableAddons.forEach((addon) => {
      const addonId = addon.id?.toString();

      addonDefaults[addonId] = {
        quantity: 0,
        customFields: {},
      };

      // every add-on uses the same addonCustomFields list
      addonCustomFields.forEach((field) => {
        if (field.defaultValue != null) {
          addonDefaults[addonId].customFields[field.name] = Array.isArray(
            field.defaultValue
          )
            ? field.defaultValue.join(',')
            : field.defaultValue;
        }
      });
    });

    const base: CheckoutFormValues = {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirmation: '',
      phone: '',
      dateOfBirth: undefined,
      street: '',
      city: '',
      postalCode: '',
      password: '',
      passwordConfirmation: '',
      isSubToTicketFairy: false,
      isSubToBrand: false,
      isCardFormComplete: false,
      country: '1',
      state: '1',
      addons: addonDefaults,
      acceptedConditions: {},
      customFields: { ...defaultCustomFieldValues.orderDefaults },
      ticketHolders,
    };

    if (customerProfile) {
      const profile = customerProfile;

      // Fill main user info
      base.firstName = profile.firstName || '';
      base.lastName = profile.lastName || '';
      base.email = profile.email || '';
      base.emailConfirmation = profile.email || '';
      base.phone = profile.phone || '';
      base.street = profile.streetAddress || '';
      base.city = profile.city || '';
      base.postalCode = profile.zipCode || '';
      base.country = profile.countryId || '-1';
      base.state = profile.stateId || '-1';
      base.dateOfBirth = profile.dateOfBirth || undefined;

      // Fill first ticket holder info from the user's profile data
      if (base.ticketHolders.length > 0) {
        base.ticketHolders[0] = {
          ...base.ticketHolders[0],
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
        };
      }
    }

    return base;
  }, [
    cartQuery.data?.data?.attributes?.cart,
    customerProfile,
    defaultCustomFieldValues,
  ]);

  const countries = useMemo(() => {
    return countriesQuery.data?.data || [];
  }, [countriesQuery.data?.data]);

  const states = useMemo(() => {
    return statesQuery?.data?.data || [];
  }, [statesQuery?.data?.data]);

  const availableAddons = useMemo(() => {
    return addonsQuery.data?.data?.attributes?.add_ons || [];
  }, [addonsQuery.data?.data?.attributes?.add_ons]);

  const conditions = useMemo(() => {
    return conditionsQuery.data?.data?.attributes?.conditions || [];
  }, [conditionsQuery.data?.data?.attributes?.conditions]);

  const eventCurrency = useMemo(() => {
    return eventInfoQuery.data?.data.attributes.currency.currency;
  }, [eventInfoQuery.data?.data.attributes.currency.currency]);

  const isLoggedIn = useMemo(() => {
    return !!customerProfile;
  }, [customerProfile]);

  // Handle payment processing
  const handlePayment = useCallback(
    async (input: ICheckoutSuccessData) => {
      try {
        setIsSubmitting(true);
        logger.debug('[useCheckoutFlow] Starting payment process', { hash: input.hash, total: input.total });

        // Get payment data
        const paymentResponse = await paymentDataMutation.mutateAsync(
          String(input.hash)
        );
        const { order_details, payment_method } =
          paymentResponse.data.attributes;
        // Check if this is a free ticket
        const isFreeTicket =
          Number(input.total) === 0 || Number(order_details.pay_now) === 0;

        if (isFreeTicket) {
          logger.debug('[useCheckoutFlow] Processing free ticket order', { hash: input.hash });
          // For free tickets, just confirm the order
          await paymentSuccessMutation.mutateAsync(String(input.hash));

          const result: OrderResult = {
            orderHash: String(input.hash),
            total: Number(input.total),
            currency: order_details.currency,
            email: input.values.email,
          };

          logger.debug('[useCheckoutFlow] Free ticket order confirmed', { hash: input.hash, email: input.values.email });
          onPaymentSuccess?.(result);
        } else {
          logger.debug('[useCheckoutFlow] Processing paid ticket with Stripe', { hash: input.hash, amount: order_details.pay_now });

          const billingDetails: BillingDetails = {
            email: input.values.email,
            name: `${input.values.firstName} ${input.values.lastName}`,
            phone: input.values.phone || undefined,
            address: {
              city: input.values.city || undefined,
              country: input.values.country || undefined,
              line1: input.values.street || undefined,
              postalCode: input.values.postalCode || undefined,
              state: input.values.state || undefined,
            },
          };

          logger.debug('[useCheckoutFlow] Confirming payment with Stripe');
          const { error: confirmError, paymentIntent } = await confirmPayment(
            payment_method.stripe_client_secret!,
            { paymentMethodType: 'Card', paymentMethodData: { billingDetails } }
          );

          if (confirmError || paymentIntent?.status !== 'Succeeded') {
            const errorMessage = confirmError?.message || 'Payment failed';
            logger.error('[useCheckoutFlow] Stripe payment failed', { 
              error: errorMessage, 
              errorCode: confirmError?.code,
              paymentIntentStatus: paymentIntent?.status 
            });
            
            // Provide user-friendly error messages
            if (errorMessage.includes('incomplete') || errorMessage.includes('not complete')) {
              throw new Error('Please complete all card details before submitting');
            }
            throw new Error(errorMessage);
          }

          logger.debug('[useCheckoutFlow] Stripe payment succeeded', { paymentIntentId: paymentIntent.id });
          // Notify backend of successful payment
          await paymentSuccessMutation.mutateAsync(String(input.hash));

          // Notify about successful payment
          const result: OrderResult = {
            orderHash: String(input.hash),
            total: Number(input.total),
            currency: order_details.currency,
            email: input.values.email,
            paymentIntentId: paymentIntent.id,
          };

          setIsSubmitting(false);
          logger.debug('[useCheckoutFlow] Payment process completed successfully', { hash: input.hash, email: input.values.email });
          onPaymentSuccess?.(result);
        }
      } catch (error) {
        logger.error('[useCheckoutFlow] Payment process failed', { error: error instanceof Error ? error.message : String(error) });
        logError(error, 'Checkout: handlePayment');
        onPaymentError?.(error);
        throw error;
      }
    },
    [
      paymentDataMutation,
      paymentSuccessMutation,
      onPaymentSuccess,
      onPaymentError,
      confirmPayment,
    ]
  );

  const handleCheckout = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        logger.debug('[useCheckoutFlow] Starting checkout process', { email: values.email, ticketHoldersCount: values.ticketHolders.length });
        const checkoutBody = createCheckoutBody(values, isAgeRequired);
        const checkoutResponse =
          await checkoutMutation.mutateAsync(checkoutBody);

        const hash = checkoutResponse.data.attributes.hash;
        const total = checkoutResponse.data.attributes.total;
        logger.debug('[useCheckoutFlow] Checkout created successfully', { hash, total, email: values.email });
        onCheckoutSuccess?.({ hash, total, values });

        return { hash, total };
      } catch (error) {
        logger.error('[useCheckoutFlow] Checkout process failed', { error: error instanceof Error ? error.message : String(error), email: values.email });
        logError(error, 'Checkout: handleCheckout');
        onCheckoutError?.(error);
        throw error;
      }
    },
    [checkoutMutation, isAgeRequired, onCheckoutSuccess, onCheckoutError]
  );

  const onSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        setIsSubmitting(true);
        if (!(await registerUser(values))) return;

        const { hash, total } = await handleCheckout(values);

        if (isSinglePageCheckout) {
          await handlePayment({
            hash,
            total,
            values,
          });
        }
      } catch (error) {
        logError(error, 'Checkout: onSubmit');
      } finally {
        setIsSubmitting(false);
      }
    },
    [registerUser, handleCheckout, isSinglePageCheckout, handlePayment]
  );

  const updateOrderItemsFromCheckoutData = useCallback(
    (cartPriceBreakdown: UpdateCheckoutResponse['attributes']['cart_price_breakdown']) => {
      if (!cartPriceBreakdown) return;

      // Update order items with the latest pricing information
      const updatedOrderItems: IOrderItem[] = [];
      const currency = cartPriceBreakdown.currency?.currency || 'USD';

      // Add ticket items
      if (cartPriceBreakdown.tickets_price_breakdown) {
        cartPriceBreakdown.tickets_price_breakdown.forEach((ticket: any) => {
          updatedOrderItems.push({
            id: ticket.ticket_type_id,
            title: ticket.ticket_type_name,
            subtitle: `${ticket.quantity} x ${priceWithCurrency(
              ticket.price_per_ticket,
              currency
            )}`,
            value: priceWithCurrency(ticket.total_price.toString(), currency),
          });
        });
      }

      // Add add-ons
      if (
        cartPriceBreakdown.total_add_ons > 0 &&
        cartPriceBreakdown.add_ons_price_breakdown &&
        Array.isArray(cartPriceBreakdown.add_ons_price_breakdown)
      ) {
        cartPriceBreakdown.add_ons_price_breakdown.forEach((addon: any) => {
          updatedOrderItems.push({
            id: `addon_${addon.add_on_name}`,
            title: `${addon.add_on_name} (Add-on)`,
            subtitle: `${addon.quantity} x ${priceWithCurrency(
              addon.price_per_add_on,
              currency
            )}`,
            value: priceWithCurrency(addon.total_price.toString(), currency),
          });
        });
      }

      // Add tax if available
      if (cartPriceBreakdown.goods_tax > 0) {
        updatedOrderItems.push({
          id: 'tax',
          title: cartPriceBreakdown.goods_tax_name || 'Tax',
          value: priceWithCurrency(
            cartPriceBreakdown.goods_tax.toString(),
            currency
          ),
        });
      }

      // Add total
      updatedOrderItems.push({
        id: 'total',
        title: 'Total',
        value: priceWithCurrency(cartPriceBreakdown.total.toString(), currency),
      });

      // Update the order items state
      setOrderItems(updatedOrderItems);
    },
    [setOrderItems]
  );

  // Function to update checkout with add-ons
  const updateCheckoutWithAddOns = useCallback(
    async (newAddons: { [key: string]: number } = {}) => {
      if (!eventId) {
        console.warn('Cannot update addons - no event ID');
        return;
      }

      const mergedAddons = { ...addons, ...newAddons };
      console.log('Updating checkout with addons', {
        eventId,
        newAddons,
        mergedAddons,
      });

      // Remove zero quantities
      Object.entries(mergedAddons).forEach(([key, value]) => {
        if (!Number(value)) {
          delete mergedAddons[key];
        }
      });

      try {
        console.log('Updating checkout with addons', {
          event_id: eventId,
          add_ons: mergedAddons,
          is_from_resale: false,
        });
        // Call the API
        const response = await updateCheckoutMutation.mutateAsync({
          attributes: {
            event_id: eventId,
            add_ons: mergedAddons,
            is_from_resale: false,
          },
        });

        console.log('Update checkout response', JSON.stringify(response));

        if (response.data?.attributes) {
          const cartPriceBreakdown =
            response.data.attributes.cart_price_breakdown;

          setAddons(mergedAddons);
          updateOrderItemsFromCheckoutData(cartPriceBreakdown);
        }
      } catch (error) {
        console.error('Failed to update addons', { error, eventId });
      }
    },
    [
      eventId,
      addons,
      updateCheckoutMutation,
      setAddons,
      updateOrderItemsFromCheckoutData,
    ]
  );

  // Function to handle addon changes from the form
  const onAddonChange = useCallback(
    (addonId: string, quantity: number) => {
      const updatedAddons = { [addonId]: quantity };
      updateCheckoutWithAddOns(updatedAddons);
    },
    [updateCheckoutWithAddOns]
  );

  const onCountryChange = useCallback(
    (countryId: string) => {
      setSelectedCountry(countryId);
    },
    [setSelectedCountry]
  );

  useEffect(() => {
    if (cartQuery.data?.data?.attributes?.expiresAt) {
      const expiresAt = cartQuery.data.data.attributes.expiresAt;
      setSecondsLeft(expiresAt);

      BackgroundTimer.runBackgroundTimer(() => {
        setSecondsLeft((prev: number | undefined) => {
          if (!prev || prev <= 1) {
            BackgroundTimer.stopBackgroundTimer();
            onCartExpired?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => BackgroundTimer.stopBackgroundTimer();
    }
  }, [cartQuery.data, setSecondsLeft, onCartExpired]);

  useEffect(() => {
    if (cartQuery.data?.data?.attributes) {
      const cartData = cartQuery.data.data.attributes;
      const currency = (cartData.cart?.[0] as any)?.currency || 'USD';
      const eventName = eventInfoQuery.data?.data.attributes.name ?? 'Event';

      const items: IOrderItem[] = [
        {
          id: 'event',
          title: 'Event',
          value: eventName,
        },
        {
          id: 'tickets',
          title: 'Number of Tickets',
          value: (cartData.cart?.[0] as any)?.quantity?.toString() || '1',
        },
      ];

      if ((cartData.cart?.[0] as any)?.price) {
        items.push({
          id: 'price',
          title: 'Ticket Price',
          value: priceWithCurrency((cartData.cart[0] as any).price, currency),
        });
      }

      const total = (cartData.cart?.[0] as any)?.price || 0;
      items.push({
        id: 'total',
        title: 'Total',
        value: priceWithCurrency(total, currency),
      });

      setOrderItems(items);
    }
  }, [cartQuery.data, eventInfoQuery.data]);

  useEffect(() => {
    if (!eventId) return;

    (async () => {
      const response = await updateCheckoutMutation.mutateAsync({
        attributes: {
          event_id: eventId,
          add_ons: addons,
          is_from_resale: false,
        },
      });
      const cartPriceBreakdown = response.data?.attributes?.cart_price_breakdown;
      const additionalPaymentInformation = response.data?.attributes?.additional_payment_information;

      const stripeConfig = {
        publishableKey: additionalPaymentInformation?.basic_config.apiKey,
        accountId: additionalPaymentInformation?.basic_config.accountId,
      };

      // await initStripe(stripeConfig);
      // setTimeout(() => {
      //   setStripeInitialized(true);
      // }, 100);

      if (cartPriceBreakdown) {
        updateOrderItemsFromCheckoutData(cartPriceBreakdown);
      }

      setCheckoutData(response.data);
    })();
  }, [eventInfoQuery.data]);

  useEffect(() => {
    if (customerProfile) {
      const profile = customerProfile;
      if (profile.countryId) {
        setSelectedCountry(profile.countryId.toString());
      }
    }
  }, [setSelectedCountry, customerProfile]);

  return {
    // Handlers
    onAddonChange,
    onCountryChange,
    onSubmit,

    setSecondsLeft,
    setSelectedCountry,

    handlePayment,

    // States
    states,
    eventId,
    countries,
    orderItems,
    conditions,
    secondsLeft,
    availableAddons,
    initialValues,
    eventCurrency,
    isSubmitting,
    isInitialLoading,
    isLoggedIn,
    isPhoneRequired,
    isAgeRequired,
    isPhoneHidden,
    minimumAge,
    isSinglePageCheckout,

    orderCustomFields,
    ticketCustomFields,
    addonCustomFields,
    checkoutData,
  };
};
