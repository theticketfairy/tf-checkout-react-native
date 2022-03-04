import React from 'react'
import { Text, View } from 'react-native'

import { Button } from '../../components'
import s from './styles'
import { IPurchaseConfirmationViewProps } from './types'

const PurchaseConfirmationView = ({
  texts,
  styles,
  onComplete,
}: IPurchaseConfirmationViewProps) => (
  <View style={[s.rootContainer, styles?.rootContainer]}>
    <Text style={[s.title, styles?.title]}>
      {texts?.title || 'Your Tickets are Confirmed!'}
    </Text>

    <View style={[s.messagesContainer, styles?.message?.container]}>
      <Text style={styles?.message?.line1}>
        {texts?.message?.line1 || 'YOUR TICKETS HAVE BEEN EMAILED TO YOU \n'}
      </Text>
      <Text style={styles?.message?.line2}>
        {texts?.message?.line2 || 'PLEASE BRING THEM WITH YOU TO THE EVENT'}
      </Text>
    </View>
    {/* 
    <View style={[s.promoContainer, styles?.promo?.container]}>
      <Text style={[s.promoTitle, styles?.promo?.title]}>
        Your ticket can become{' '}
        <Text style={[s.promoTitleKeyword, styles?.promo?.titleKeyword]}>
          cheaper
        </Text>{' '}
        or even{' '}
        <Text style={[s.promoTitleKeyword, styles?.promo?.titleKeyword]}>
          FREE!
        </Text>
      </Text>

      <Text style={[s.promoMessage, styles?.promo?.message]}>
        <Text style={[s.promoMessageKeyword, styles?.promo?.messageKeyword]}>
          Invite friends
        </Text>{' '}
        and we'll refund up to{' '}
        <Text style={[s.promoDiscount, styles?.promo?.discount]}>
          {texts?.promo?.discount || '100%'}
        </Text>{' '}
        of your ticket money, if they buy tickets as well!
      </Text>
    </View>

    <View style={[s.inviteContainer, styles?.invite?.container]}>
      <Text style={[s.inviteTitle, styles?.invite?.title]}>
        {texts?.invite?.title || 'How do you invite your friends?'}
      </Text>
      <Text style={[s.inviteMessage, styles?.invite?.message]}>
        {texts?.invite?.message || 'Send them this link:'}
      </Text>

      <View style={[s.inviteLinkContainer, styles?.invite?.linkContainer]}>
        <Text style={[s.inviteLink, styles?.invite?.link]}>
          {referralLink || 'http://www.theticketfairy.com'}
        </Text>
        <TouchableOpacity style={[s.copyButton, styles?.invite?.copyButton]}>
          <Image
            source={R.icons.copy}
            style={[s.copyIcon, styles?.invite?.copyIcon]}
          />
        </TouchableOpacity>
      </View>
    </View> */}
    <Button
      text={texts?.exitButton || 'Exit'}
      styles={styles?.exitButton}
      onPress={onComplete}
    />
  </View>
)

export default PurchaseConfirmationView
