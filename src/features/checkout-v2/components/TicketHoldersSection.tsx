import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Input, PhoneInput } from '../../../components'
import { TicketHolderFormValues } from '../form/types'

interface TicketHoldersSectionProps {
  ticketHolders: TicketHolderFormValues[]
  onChange: (
    index: number,
    field: keyof TicketHolderFormValues,
    value: string
  ) => void
  errors?: Array<Partial<Record<keyof TicketHolderFormValues, string>>>
  touched?: Array<Partial<Record<keyof TicketHolderFormValues, boolean>>>
  onFieldBlur?: (index: number, field: keyof TicketHolderFormValues) => void
  isPhoneRequired?: boolean
  isPhoneHidden?: boolean
}

export const TicketHoldersSection: React.FC<TicketHoldersSectionProps> = ({
  ticketHolders,
  onChange,
  errors,
  touched,
  onFieldBlur,
  isPhoneRequired = false,
  isPhoneHidden = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ticket Holders Information</Text>
      <Text style={styles.sectionDescription}>
        Please provide details for each ticket holder
      </Text>

      {ticketHolders.map((holder, index) => {
        const touchedFields = touched ? touched[index] : {}
        const errorFields = errors ? errors[index] : {}

        return (
          <View
            key={`ticket-holder-${index + 1}`}
            style={styles.ticketHolderContainer}
          >
            <Text style={styles.ticketHolderTitle}>
              {`Ticket ${index + 1}`}
            </Text>

            <View style={styles.formGroup}>
              <Input
                label='First Name *'
                value={holder.firstName}
                onChangeText={(value) => onChange(index, 'firstName', value)}
                onBlur={() => onFieldBlur?.(index, 'firstName')}
                error={
                  touchedFields?.firstName ? errorFields?.firstName : undefined
                }
                placeholder='Enter first name'
              />
            </View>

            <View style={styles.formGroup}>
              <Input
                label='Last Name *'
                value={holder.lastName}
                onChangeText={(value) => onChange(index, 'lastName', value)}
                onBlur={() => onFieldBlur?.(index, 'lastName')}
                error={
                  touchedFields?.lastName ? errorFields?.lastName : undefined
                }
                placeholder='Enter last name'
              />
            </View>

            <View style={styles.formGroup}>
              <Input
                label='Email'
                value={holder.email}
                onChangeText={(value) => onChange(index, 'email', value)}
                onBlur={() => onFieldBlur?.(index, 'email')}
                error={touchedFields?.email ? errorFields?.email : undefined}
                placeholder='Enter email address'
                keyboardType='email-address'
              />
            </View>

            {!isPhoneHidden && (
              <View style={styles.formGroup}>
                <PhoneInput
                  phoneNumber={holder.phone}
                  onChangePhoneNumber={(payload) => {
                    onChange(index, 'phone', payload.input)
                  }}
                  error={errorFields?.phone}
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
  container: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  ticketHolderContainer: {
    marginBottom: 8,
  },
  ticketHolderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {},
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
  },
})

export default TicketHoldersSection
