import React, { type FC, useEffect, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import type { TextField } from 'rn-material-ui-textfield'

import { Button, Checkbox, Input, RadioButton } from '../../components'
import {
  type IResaleTicketsViewProps,
  type IResaleTicketsViewTexts,
  ResaleToWhomFieldIdEnum,
} from './types'

const ResaleTicketsView: FC<IResaleTicketsViewProps> = ({
  styles,
  isDataValid,
  resaleToWhomData,
  onResaleToWhomDataChanged,
  someoneDataErrors,
  onPressResaleTickets,
  ticket,
  isLoading,
  texts,
  isTicketsTypeActive,
}) => {
  //#region Texts
  const txt: IResaleTicketsViewTexts = {
    title: texts?.title || 'Resale tickets',
    orderDetails: {
      title: texts?.orderDetails?.title || 'Order details',
      eventName: texts?.orderDetails?.eventName || 'Event',
      orderedBy: texts?.orderDetails?.orderedBy || 'Ordered By',
      orderId: texts?.orderDetails?.orderId || 'Order ID',
    },
    sellToWhom: {
      title: texts?.sellToWhom?.title || 'Sell to whom?',
      anyone:
        texts?.sellToWhom?.anyone ||
        'I will sell my ticket to anyone who wants to buy it',
      friend:
        texts?.sellToWhom?.friend || 'I will sell my ticket to someone I know',
    },
    terms: {
      title: texts?.terms?.title || 'Terms of resale',
      paragraph1:
        texts?.terms?.paragraph1 ||
        'I confirm that I want to sell this ticket and that, if someone chooses to buy it, I will no longer own it or have the right to ask for it back. \n',
      paragraph2_1:
        texts?.terms?.paragraph2_1 ||
        'I also understand that, if no one chooses to buy it, it remains my property, is valid for entry to',
      paragraph2_2:
        texts?.terms?.paragraph2_2 || 'and I will not receive any refund.',
      paragraph3_1:
        texts?.terms?.paragraph3_1 ||
        'If my ticket is sold, the original card I used to buy my ticket will be refunded with the original amount paid, minus a small handling fee of',
      paragraph3_2:
        texts?.terms?.paragraph3_2 ||
        ', and that any existing refunds due to me for referring sales for this event are no longer valid.',
    },
    agree: texts?.agree || 'I agree',
    friendForm: {
      firstName: texts?.friendForm?.firstName || 'First Name',
      lastName: texts?.friendForm?.lastName || 'Last Name',
      email: texts?.friendForm?.email || 'Email Address',
      emailConfirm: texts?.friendForm?.emailConfirm || 'Confirm Email Address',
    },
    resaleTicketsButton: texts?.resaleTicketsButton || 'Resale Ticket',
  }
  //#endregion

  //#region Refs
  const firstNameRef = useRef<TextField>(null)
  const lastNameRef = useRef(null)
  const emailRef = useRef(null)
  const confirmEmailRef = useRef(null)
  //#endregion

  //#region Styles
  const ticketBuyerFormStyles = styles?.ticketBuyerForm
  const ticketOrderDetailsStyles = styles?.ticketOrderDetails
  const termsStyles = styles?.terms
  const buttonStyles = !isDataValid
    ? styles?.resaleTicketsButtonDisabled
    : styles?.resaleTicketsButton
  //#endregion

  const {
    someoneData: { firstName, lastName, email, emailConfirm },
    toWhom,
    isTermsAgreed,
  } = resaleToWhomData

  const {
    firstNameError,
    lastNameError,
    emailError,
    emailConfirmError,
  } = someoneDataErrors

  const Terms = useMemo(
    () => (
      <View style={termsStyles?.rootContainer}>
        <Text style={termsStyles?.title}>{txt.terms?.title}</Text>
        <Text style={termsStyles?.item}>{txt.terms?.paragraph1}</Text>

        <Text style={termsStyles?.item}>
          {txt.terms?.paragraph2_1}{' '}
          <Text style={termsStyles?.itemBold}>{ticket.eventName}</Text>{' '}
          {txt.terms?.paragraph2_2}
          {'\n'}
        </Text>
        <Text style={termsStyles?.item}>
          {txt.terms?.paragraph3_1}{' '}
          <Text style={termsStyles?.itemBold}>
            {ticket.currency} {ticket.resaleFeeAmount}
          </Text>
          {txt.terms?.paragraph3_2}
        </Text>

        <Checkbox
          onPress={() =>
            onResaleToWhomDataChanged(ResaleToWhomFieldIdEnum.terms)
          }
          isActive={isTermsAgreed}
          styles={styles?.termsCheckbox}
          text={txt.agree}
        />
      </View>
    ),
    [
      isTermsAgreed,
      onResaleToWhomDataChanged,
      styles?.termsCheckbox,
      termsStyles?.item,
      termsStyles?.itemBold,
      termsStyles?.rootContainer,
      termsStyles?.title,
      ticket.currency,
      ticket.eventName,
      ticket.resaleFeeAmount,
      txt.agree,
      txt.terms?.paragraph1,
      txt.terms?.paragraph2_1,
      txt.terms?.paragraph2_2,
      txt.terms?.paragraph3_1,
      txt.terms?.paragraph3_2,
      txt.terms?.title,
    ]
  )

  const OrderDetails = useMemo(
    () => (
      <View style={ticketOrderDetailsStyles?.rootContainer}>
        <Text style={ticketOrderDetailsStyles?.title}>
          {txt.orderDetails?.title}
        </Text>
        <Text style={ticketOrderDetailsStyles?.label}>
          {txt.orderDetails?.eventName}
        </Text>
        <Text style={ticketOrderDetailsStyles?.value}>{ticket.eventName}</Text>
        <Text style={ticketOrderDetailsStyles?.label}>
          {txt.orderDetails?.orderedBy}
        </Text>
        <Text style={ticketOrderDetailsStyles?.value}>{ticket.holderName}</Text>
        <Text style={ticketOrderDetailsStyles?.label}>
          {txt.orderDetails?.orderId}
        </Text>
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
      txt.orderDetails?.eventName,
      txt.orderDetails?.orderId,
      txt.orderDetails?.orderedBy,
      txt.orderDetails?.title,
    ]
  )

  const TicketBuyerForm = useMemo(
    () => (
      <View style={ticketBuyerFormStyles?.rootContainer}>
        <Text style={ticketBuyerFormStyles?.title}>
          {txt.sellToWhom?.title}
        </Text>
        {isTicketsTypeActive && (
          <RadioButton
            styles={ticketBuyerFormStyles?.radioButtons}
            index={0}
            text={txt.sellToWhom!.friend!}
            value={toWhom === 'friend'}
            onValueChange={() =>
              onResaleToWhomDataChanged(ResaleToWhomFieldIdEnum.radioIndex, 0)
            }
          />
        )}
        {toWhom === 'friend' && (
          <View style={ticketBuyerFormStyles?.formContainer}>
            <Input
              reference={firstNameRef}
              label={txt.friendForm!.firstName!}
              value={firstName}
              onChangeText={(text) =>
                onResaleToWhomDataChanged(
                  ResaleToWhomFieldIdEnum.firstName,
                  text
                )
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={firstNameError}
              blurOnSubmit={false}
              //@ts-ignore
              onSubmitEditing={lastNameRef.current?.focus}
              returnKeyType='next'
            />
            <Input
              reference={lastNameRef}
              label={txt.friendForm!.lastName!}
              value={lastName}
              onChangeText={(text) =>
                onResaleToWhomDataChanged(
                  ResaleToWhomFieldIdEnum.lastName,
                  text
                )
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={lastNameError}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (emailRef.current) {
                  //@ts-ignore
                  emailRef.current.focus()
                }
              }}
              returnKeyType='next'
            />
            <Input
              reference={emailRef}
              label={txt.friendForm!.email!}
              autoCapitalize='none'
              keyboardType='email-address'
              value={email}
              onChangeText={(text) =>
                onResaleToWhomDataChanged(ResaleToWhomFieldIdEnum.email, text)
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={emailError}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (confirmEmailRef.current) {
                  //@ts-ignore
                  confirmEmailRef.current.focus()
                }
              }}
              returnKeyType='next'
            />
            <Input
              reference={confirmEmailRef}
              label={txt.friendForm!.emailConfirm!}
              autoCapitalize='none'
              keyboardType='email-address'
              value={emailConfirm}
              onChangeText={(text) =>
                onResaleToWhomDataChanged(
                  ResaleToWhomFieldIdEnum.emailConfirm,
                  text
                )
              }
              styles={ticketBuyerFormStyles?.inputs}
              error={emailConfirmError}
              blurOnSubmit={true}
              returnKeyType='go'
            />
          </View>
        )}
        {isTicketsTypeActive && (
          <RadioButton
            styles={ticketBuyerFormStyles?.radioButtons}
            index={1}
            text={txt.sellToWhom!.anyone!}
            value={toWhom === 'anyone'}
            onValueChange={() =>
              onResaleToWhomDataChanged(ResaleToWhomFieldIdEnum.radioIndex, 1)
            }
          />
        )}
      </View>
    ),
    [
      email,
      emailConfirm,
      emailConfirmError,
      emailError,
      firstName,
      firstNameError,
      isTicketsTypeActive,
      lastName,
      lastNameError,
      onResaleToWhomDataChanged,
      ticketBuyerFormStyles?.formContainer,
      ticketBuyerFormStyles?.inputs,
      ticketBuyerFormStyles?.radioButtons,
      ticketBuyerFormStyles?.rootContainer,
      ticketBuyerFormStyles?.title,
      toWhom,
      txt.friendForm,
      txt.sellToWhom,
    ]
  )

  useEffect(() => {
    if (!isTicketsTypeActive) {
      onResaleToWhomDataChanged(ResaleToWhomFieldIdEnum.radioIndex, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View style={styles?.rootContainer}>
        <Text style={styles?.title}>{txt.title}</Text>
        {OrderDetails}
        {TicketBuyerForm}
        {Terms}
        <Button
          styles={buttonStyles}
          text={txt.resaleTicketsButton!}
          onPress={onPressResaleTickets}
          isDisabled={!isDataValid}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ResaleTicketsView
