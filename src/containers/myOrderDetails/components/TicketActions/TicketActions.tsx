import React, { FC } from 'react'
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { ITicketActionsProps } from './TicketActionsTypes'

const TicketActions: FC<ITicketActionsProps> = ({
  onSelectAction,
  ticket,
  icons,
  texts,
  styles,
}) => {
  const handleOnPressDownload = () => onSelectAction('download-pdf')
  const handleOnPressSell = () => onSelectAction('sell')
  const handleOnPressRemoveFromSale = () => onSelectAction('remove-from-sale')

  const renderButton = (
    onPress: () => void,
    text: string,
    icon?: ImageSourcePropType
  ) => (
    <TouchableOpacity onPress={onPress} style={styles?.buttonContainer}>
      <View style={styles?.buttonContent}>
        {!!icon && <Image source={icon} style={styles?.icon} />}
        <Text style={styles?.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )

  const downloadPdf =
    ticket.pdfLink &&
    renderButton(
      handleOnPressDownload,
      texts?.downloadPdf || 'Download PDF',
      icons?.downloadPdf
    )

  const sellTicket =
    ticket.isSellable &&
    !ticket.isOnSale &&
    renderButton(handleOnPressSell, texts?.sell || 'Sell Ticket', icons?.sell)

  const removeFromResale =
    !ticket.isSellable &&
    ticket.isOnSale &&
    renderButton(
      handleOnPressRemoveFromSale,
      texts?.removeFromSale || 'Remove from resale',
      icons?.removeFromSale
    )

  return (
    <ScrollView style={[styles?.rootScrollViewContainer]}>
      {downloadPdf}
      {sellTicket}
      {removeFromResale}
    </ScrollView>
  )
}

export default TicketActions
