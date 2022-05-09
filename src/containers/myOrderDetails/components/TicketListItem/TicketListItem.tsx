import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { Button } from '../../../../components'
import R from '../../../../res'
import s from './TicketListItemStyles'
import { ITicketListItemProps } from './TicketListItemTypes'

export interface IOnPressTicketDownload {
  pdfLink?: string
  hash: string
}

const TicketListItem = ({
  onPressSellTicket,
  onPressRemoveTicketFromResale,
  onPressTicketDownload,
  styles,
  texts,
  data,
  isLoading,
  moreButtonIcon,
}: ITicketListItemProps) => {
  const handleOnPressSellTicket = () => {
    onPressSellTicket(data)
  }

  const handleOnPressRemoveFromResale = async () => {
    onPressRemoveTicketFromResale(data)
  }

  const handleOnPressTicketDownload = () =>
    onPressTicketDownload({
      pdfLink: data.pdfLink,
      hash: data.hash,
    })

  return (
    <View>
      <View style={[s.rootContainer, styles?.rootContainer]}>
        <View style={styles?.leftContent}>
          <View style={s.rowContainer}>
            <Text style={styles?.rowPlaceholder}>{texts.ticketId}</Text>
            <Text style={styles?.rowValue}>{data.hash}</Text>
          </View>
          <View style={s.rowContainer}>
            <Text style={styles?.rowPlaceholder}>{texts.ticketType}</Text>
            <Text style={styles?.rowValue}>{data.ticketType}</Text>
          </View>
          <View style={s.rowContainer}>
            <Text style={styles?.rowPlaceholder}>{texts.holderName}</Text>
            <Text style={styles?.rowValue}>{data.holderName}</Text>
          </View>
        </View>

        <View style={[s.rightContent, styles?.rightContent]}>
          <Text style={styles?.rowPlaceholder}>
            {texts.status}
            <Text style={styles?.rowValue}>{data.status}</Text>
          </Text>

          <TouchableOpacity style={[s.moreButton, styles?.moreButton]}>
            <Image
              source={moreButtonIcon || R.icons.more}
              style={[s.moreButtonIcon, styles?.moreButtonIcon]}
            />
          </TouchableOpacity>

          {1 === 0 && data.pdfLink && (
            <Button
              isLoading={isLoading}
              text={texts.download}
              styles={{
                text: s.downloadButtonText,
                button: s.downloadButton,
                ...styles?.downloadButton,
              }}
              onPress={handleOnPressTicketDownload}
            />
          )}
        </View>
      </View>
      {1 === 0 && data.isSellable && !data.isOnSale && (
        <Button
          onPress={handleOnPressSellTicket}
          text={texts.sellTicket}
          // styles={{
          //   container: s.resaleButtonContainer,
          //   button: s.resaleButton,
          //   text: s.resaleButtonText,
          //   ...styles?.resaleButton,
          // }}
        />
      )}
      {1 === 0 && !data.isSellable && data.isOnSale && (
        <Button
          onPress={handleOnPressRemoveFromResale}
          text={texts.removeTicketFromResale}
          // styles={{
          //   container: s.resaleButtonContainer,
          //   button: s.resaleButton,
          //   text: s.resaleButtonText,
          //   ...styles?.resaleButton,
          // }}
        />
      )}
    </View>
  )
}

export default TicketListItem
