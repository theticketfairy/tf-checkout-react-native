import React, { FC, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button, Checkbox, Input, RadioButton } from '../../components'
import { IResaleTicketsViewProps, SellToWhomFieldIdEnum } from './types'

const ResaleTicketsView: FC<IResaleTicketsViewProps> = ({
  styles,
  isDataValid,
  sellToWhomData,
  onSellToWhomDataChanged,
  someoneDataErrors,
  onPressSellTickets,
  ticket,
}) => {
  const buttonStyles = !isDataValid
    ? styles?.sellTicketsButtonDisabled
    : styles?.sellTicketsButton

  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const emailRef = useRef(null)
  const confirmEmailRef = useRef(null)

  const ticketBuyerFormStyles = styles?.ticketBuyerForm
  const ticketOrderDetailsStyles = styles?.ticketOrderDetails
  const termsStyles = styles?.terms

  const {
    someoneData: { firstName, lastName, email, emailConfirm },
    toWhom,
    isTermsAgreed,
  } = sellToWhomData

  const { firstNameError, lastNameError, emailError, emailConfirmError } =
    someoneDataErrors

  const Terms = useMemo(
    () => (
      <View style={termsStyles?.rootContainer}>
        <Text style={termsStyles?.title}>Terms of resale</Text>
        <Text style={termsStyles?.item}>
          I confirm that I want to sell this ticket and that, if someone chooses
          to buy it, I will no longer own it or have the right to ask for it
          back.{'\n'}
        </Text>

        <Text style={termsStyles?.item}>
          I also understand that, if no one chooses to buy it, it remains my
          property, is valid for entry to{' '}
          <Text style={termsStyles?.itemBold}>{ticket.eventName}</Text> and I
          will not receive any refund.{'\n'}
        </Text>
        <Text style={termsStyles?.item}>
          If my ticket is sold, the original card I used to buy my ticket will
          be refunded with the original amount paid, minus a small handling fee
          of <Text style={termsStyles?.itemBold}>US$ {ticket.feeAmount}</Text> ,
          and that any existing refunds due to me for referring sales for this
          event are no longer valid.{'\n'}
        </Text>

        <Checkbox
          onPress={() => onSellToWhomDataChanged(SellToWhomFieldIdEnum.terms)}
          isActive={isTermsAgreed}
          styles={styles?.termsCheckbox}
          text={'I agree'}
        />
      </View>
    ),
    [
      isTermsAgreed,
      onSellToWhomDataChanged,
      styles?.termsCheckbox,
      termsStyles?.item,
      termsStyles?.itemBold,
      termsStyles?.rootContainer,
      termsStyles?.title,
      ticket.eventName,
      ticket.feeAmount,
    ]
  )

  const OrderDetails = useMemo(
    () => (
      <View style={ticketOrderDetailsStyles?.rootContainer}>
        <Text style={ticketOrderDetailsStyles?.title}>Order Details</Text>
        <Text style={ticketOrderDetailsStyles?.label}>Event</Text>
        <Text style={ticketOrderDetailsStyles?.value}>{ticket.eventName}</Text>
        <Text style={ticketOrderDetailsStyles?.label}>Ordered By</Text>
        <Text style={ticketOrderDetailsStyles?.value}>{ticket.holderName}</Text>
        <Text style={ticketOrderDetailsStyles?.label}>Order ID</Text>
        <Text style={ticketOrderDetailsStyles?.value}>{ticket.hash}</Text>
      </View>
    ),
    [
      ticket.eventName,
      ticket.hash,
      ticket.holderName,
      ticketOrderDetailsStyles?.label,
      ticketOrderDetailsStyles?.rootContainer,
      ticketOrderDetailsStyles?.title,
      ticketOrderDetailsStyles?.value,
    ]
  )

  const TicketBuyerForm = useMemo(
    () => (
      <View style={ticketBuyerFormStyles?.rootContainer}>
        <Text style={ticketBuyerFormStyles?.title}>Sell to Whom?</Text>
        <RadioButton
          styles={ticketBuyerFormStyles?.radioButtons}
          index={0}
          text='I will sell my ticket to someone I know'
          value={toWhom === 'someone'}
          onValueChange={() =>
            onSellToWhomDataChanged(SellToWhomFieldIdEnum.radioIndex, 0)
          }
        />
        {toWhom === 'someone' && (
          <View style={ticketBuyerFormStyles?.formContainer}>
            <Input
              reference={firstNameRef}
              label='First Name'
              value={firstName}
              onChangeText={(txt) =>
                onSellToWhomDataChanged(SellToWhomFieldIdEnum.firstName, txt)
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={firstNameError}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (lastNameRef.current) {
                  lastNameRef.current.focus()
                }
              }}
              returnKeyType='next'
            />
            <Input
              reference={lastNameRef}
              label='Last Name'
              value={lastName}
              onChangeText={(txt) =>
                onSellToWhomDataChanged(SellToWhomFieldIdEnum.lastName, txt)
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={lastNameError}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (emailRef.current) {
                  emailRef.current.focus()
                }
              }}
              returnKeyType='next'
            />
            <Input
              reference={emailRef}
              label='Email Address'
              autoCapitalize='none'
              keyboardType='email-address'
              value={email}
              onChangeText={(txt) =>
                onSellToWhomDataChanged(SellToWhomFieldIdEnum.email, txt)
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={emailError}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (confirmEmailRef.current) {
                  confirmEmailRef.current.focus()
                }
              }}
              returnKeyType='next'
            />
            <Input
              reference={confirmEmailRef}
              label='Confirm Email Address'
              autoCapitalize='none'
              keyboardType='email-address'
              value={emailConfirm}
              onChangeText={(txt) =>
                onSellToWhomDataChanged(SellToWhomFieldIdEnum.emailConfirm, txt)
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={emailConfirmError}
              blurOnSubmit={true}
              returnKeyType='go'
            />
          </View>
        )}
        <RadioButton
          styles={ticketBuyerFormStyles?.radioButtons}
          index={1}
          text='I will sell my ticket to anyone who wants to buy it'
          value={toWhom === 'anyone'}
          onValueChange={() =>
            onSellToWhomDataChanged(SellToWhomFieldIdEnum.radioIndex, 1)
          }
        />
      </View>
    ),
    [
      email,
      emailConfirm,
      emailConfirmError,
      emailError,
      firstName,
      firstNameError,
      lastName,
      lastNameError,
      onSellToWhomDataChanged,
      ticketBuyerFormStyles?.formContainer,
      ticketBuyerFormStyles?.inputs,
      ticketBuyerFormStyles?.radioButtons,
      ticketBuyerFormStyles?.rootContainer,
      ticketBuyerFormStyles?.title,
      toWhom,
    ]
  )

  return (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View style={styles?.rootContainer}>
        <Text style={styles?.title}>Sell tickets</Text>
        {OrderDetails}
        {TicketBuyerForm}
        {Terms}

        <Button
          styles={buttonStyles}
          text='Sell Ticket'
          onPress={onPressSellTickets}
          isDisabled={!isDataValid}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ResaleTicketsView
