import React, { useCallback, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { ErrorDisplay } from '../errorDisplay'

interface IBillingFormData {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  phone: string
}

interface ISimpleBillingFormProps {
  initialValues?: Partial<IBillingFormData>
  onSubmit: (values: IBillingFormData) => void
  onValidationChange?: (isValid: boolean) => void
  isLoading?: boolean
  error?: string | null
  onErrorClose?: () => void
  buttonText?: string
}

export const SimpleBillingForm: React.FC<ISimpleBillingFormProps> = ({
  initialValues = {},
  onSubmit,
  onValidationChange,
  isLoading = false,
  error,
  onErrorClose,
  buttonText = 'Continue',
}) => {
  const [values, setValues] = useState<IBillingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    ...initialValues,
  })

  const [errors, setErrors] = useState<Partial<IBillingFormData>>({})

  const validateForm = useCallback(() => {
    const newErrors: Partial<IBillingFormData> = {}

    if (!values.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!values.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!values.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!values.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Please confirm your email'
    } else if (values.email !== values.confirmEmail) {
      newErrors.confirmEmail = 'Emails must match'
    }

    if (!values.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    onValidationChange?.(isValid)
    return isValid
  }, [values, onValidationChange])

  const handleFieldChange = useCallback(
    (field: keyof IBillingFormData, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(values)
    }
  }, [values, validateForm, onSubmit])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ErrorDisplay
        error={error || ''}
        onClose={onErrorClose}
        severity='error'
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, errors.firstName ? styles.inputError : null]}
            value={values.firstName}
            onChangeText={(text) => handleFieldChange('firstName', text)}
            placeholder='Enter your first name'
            autoCapitalize='words'
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={[styles.input, errors.lastName ? styles.inputError : null]}
            value={values.lastName}
            onChangeText={(text) => handleFieldChange('lastName', text)}
            placeholder='Enter your last name'
            autoCapitalize='words'
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={values.email}
            onChangeText={(text) => handleFieldChange('email', text)}
            placeholder='Enter your email'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Email *</Text>
          <TextInput
            style={[
              styles.input,
              errors.confirmEmail ? styles.inputError : null,
            ]}
            value={values.confirmEmail}
            onChangeText={(text) => handleFieldChange('confirmEmail', text)}
            placeholder='Confirm your email'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
          {errors.confirmEmail && (
            <Text style={styles.errorText}>{errors.confirmEmail}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={values.phone}
            onChangeText={(text) => handleFieldChange('phone', text)}
            placeholder='Enter your phone number'
            keyboardType='phone-pad'
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Processing...' : buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
