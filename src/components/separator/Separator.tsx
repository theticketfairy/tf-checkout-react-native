import React from 'react'
import { View } from 'react-native'

import { ISeparatorProps } from './types'

const Separator = ({
  color,
  height,
  width,
  marginLeft,
  marginVertical,
}: ISeparatorProps) => {
  return (
    <View
      style={{
        height: height || 1,
        backgroundColor: color || '#DEDEDE',
        width: width || '99%',
        marginLeft: marginLeft || '0.5%',
        marginVertical: marginVertical,
      }}
    />
  )
}

export default Separator
