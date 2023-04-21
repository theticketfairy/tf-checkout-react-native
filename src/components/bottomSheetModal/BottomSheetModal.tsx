import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Modal as RNModal,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import R from '../../res'
import s from './BottomSheetModalStyles'
import type { IBottomSheetModalProps } from './BottomSheetModalTypes'

const animationDuration = 350
const { height: screenHeight } = Dimensions.get('window')

export type BottomSheetHandle = {
  close(): void
}

const BottomSheetModal = forwardRef<BottomSheetHandle, IBottomSheetModalProps>(
  (
    { onClose, texts, styles, content, contentHeight = screenHeight / 2 },
    ref
  ) => {
    const contentYPosition = useRef(new Animated.Value(contentHeight)).current

    const showContent = () => {
      Animated.timing(contentYPosition, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start()
    }

    const hideContent = () => {
      Animated.timing(contentYPosition, {
        toValue: contentHeight,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(onClose)
    }

    useEffect(() => {
      showContent()
    })

    const onCloseHandler = () => {
      hideContent()
    }

    const animatedStyle: StyleProp<any> = {
      height: contentHeight,
      transform: [
        {
          translateY: contentYPosition,
        },
      ],
    }

    useImperativeHandle(ref, () => ({
      async close() {
        hideContent()
      },
    }))

    const mergedStyle = [s.animatedContent, animatedStyle, styles?.content]

    const title = texts?.title || 'Title'

    return (
      <RNModal transparent>
        <View style={[s.rootContainer, styles?.rootContainer]}>
          <Animated.View style={mergedStyle}>
            <View style={[s.header, styles?.headerContainer]}>
              <Text style={[s.title, styles?.title]}>{title}</Text>
              <TouchableOpacity
                onPress={onCloseHandler}
                style={[s.closeButton, styles?.closeButton]}
              >
                <Image
                  style={[s.closeButtonIcon, styles?.closeButtonIcon]}
                  source={R.icons.error}
                />
              </TouchableOpacity>
            </View>
            <View style={[s.contentContainer, styles?.contentContainer]}>
              {content}
            </View>
          </Animated.View>
        </View>
      </RNModal>
    )
  }
)

export default BottomSheetModal
