import { FormikErrors } from 'formik'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { FormField, PhoneInput } from '../../../components'
import { TicketHolderFormValues } from '../form/types'

interface TicketHoldersSectionProps {
  ticketHolders: TicketHolderFormValues[]
  onChange: (
    index: number,
    field: keyof TicketHolderFormValues,
    value: string
  ) => void
  errors?: FormikErrors<TicketHolderFormValues>[]
  touched?: Array<Partial<Record<keyof TicketHolderFormValues, boolean>>>
  onFieldBlur?: (index: number, field: keyof TicketHolderFormValues) => void
  isPhoneHidden?: boolean
}

export const TicketHoldersSection: React.FC<TicketHoldersSectionProps> = ({
  ticketHolders,
  onChange,
  errors,
  touched,
  onFieldBlur,
  isPhoneHidden = false,
}) => {
  return (
    <View style={styles.container}>
      <FormField fieldType='title' title='Ticket Holders Information' />
      <FormField
        fieldType='text'
        title='Please provide details for each ticket holder'
      />

      {ticketHolders.map((holder, index) => {
        const errorFields = errors ? errors[index] : {}
        const touchedFields = touched ? touched[index] : {}

        return (
          <View
            key={`ticket-holder-${index + 1}`}
            style={styles.ticketHolderContainer}
          >
            <Text style={styles.ticketHolderTitle}>Ticket {index + 1}</Text>

            <View style={styles.formGroup}>
              <FormField
                fieldType='input'
                id={`firstName-${index}`}
                error={
                  touchedFields?.firstName ? errorFields?.firstName : undefined
                }
                inputProps={{
                  label: 'First Name *',
                  value: holder.firstName,
                  onTextChanged: (key, value) =>
                    onChange(index, 'firstName', value),
                  onBlur: () => onFieldBlur?.(index, 'firstName'),
                  placeholder: 'Enter first name',
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <FormField
                fieldType='input'
                id={`lastName-${index}`}
                error={
                  touchedFields?.lastName ? errorFields?.lastName : undefined
                }
                inputProps={{
                  label: 'Last Name *',
                  value: holder.lastName,
                  onTextChanged: (key, value) =>
                    onChange(index, 'lastName', value),
                  onBlur: () => onFieldBlur?.(index, 'lastName'),
                  placeholder: 'Enter last name',
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <FormField
                fieldType='input'
                id={`email-${index}`}
                error={touchedFields?.email ? errorFields?.email : undefined}
                inputProps={{
                  label: 'Email',
                  value: holder.email,
                  onTextChanged: (key, value) =>
                    onChange(index, 'email', value),
                  onBlur: () => onFieldBlur?.(index, 'email'),
                  placeholder: 'Enter email address',
                  keyboardType: 'email-address',
                }}
              />
            </View>

            {!isPhoneHidden && (
              <View style={styles.formGroup}>
                <PhoneInput
                  phoneNumber={holder.phone}
                  onChangePhoneNumber={(payload) => {
                    onChange(index, 'phone', payload.input)
                  }}
                  error={touchedFields?.phone ? errorFields?.phone : undefined}
                  texts={{
                    label: 'Phone Number',
                  }}
                />
              </View>
            )}

            <View style={styles.divider} />
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  ticketHolderContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 8,
  },
  ticketHolderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginTop: 16,
  },
})

export default TicketHoldersSection
