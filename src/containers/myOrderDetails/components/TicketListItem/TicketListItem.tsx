import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import R from '../../../../res'
import s from './TicketListItemStyles'
import type { ITicketListItemProps } from './TicketListItemTypes'

export interface IOnPressTicketDownload {
  pdfLink?: string
  hash: string
}



const TicketListItem = ({
  styles,
  texts,
  data,
  moreButtonIcon,
  onPressActionsButton,
}: ITicketListItemProps) => {
  const handleOnPressActionsButton = () => {
    onPressActionsButton(data)
  }

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

          <TouchableOpacity
            style={[s.moreButton, styles?.moreButton]}
            onPress={handleOnPressActionsButton}
          >
            <Image
              source={moreButtonIcon || R.icons.more}
              style={[s.moreButtonIcon, styles?.moreButtonIcon]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TicketListItem
