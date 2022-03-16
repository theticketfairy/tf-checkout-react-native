import { View, Text, Modal, ColorValue } from 'react-native'
import React, { FC } from 'react'

interface ICustomLoadingProps {
  text?: string
  backgroundColor?: ColorValue
}

const CustomLoading: FC<ICustomLoadingProps> = ({ text, backgroundColor}) => {
  return (
    <Modal presentationStyle='overFullScreen' transparent={true} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,240,222,0.5)' }}>
      <View style={{ height: 200, width: 200, backgroundColor: backgroundColor || 'red', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontWeight: '700'}}>{text || 'CustomLoading'}</Text>
      </View>
      </View>
    </Modal>
  )
}

export default CustomLoading