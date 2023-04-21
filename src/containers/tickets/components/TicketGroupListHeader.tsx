import React, { FC } from 'react'
import { Text, View } from 'react-native'

import type { ITicketGroupListHeaderProps } from './types'

const TicketGroupListHeader: FC<ITicketGroupListHeaderProps> = ({
  styles,
  text,
}) => (
  <View style={styles?.container}>
    {!!text && <Text style={styles?.text}>{text}</Text>}
  </View>
)

export default TicketGroupListHeader
