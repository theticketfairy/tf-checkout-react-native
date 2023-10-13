import React from 'react'
import { ActivityIndicator, Modal, Text, View } from 'react-native'

import R from '../../res'
import s from './styles'
import type { ILoadingProps } from './types'



const Loading = ({
  text = 'Loading...',
  styles,
  customComponent,
}: ILoadingProps) => {
  return (
    <Modal presentationStyle='overFullScreen' transparent={true}>
      <View style={s.rootContainer}>
        <View style={[s.content, styles?.content]}>
          {customComponent ? (
            customComponent
          ) : (
            <>
              <ActivityIndicator
                size={styles?.animation?.size || 'large'}
                color={styles?.animation?.color || R.colors.black}
              />
              <Text style={[s.text, styles?.text]}>{text}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default Loading
