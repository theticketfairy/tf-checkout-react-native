//@ts-nocheck

import React from 'react'
import { View } from 'react-native'
import { OutlinedTextField as TextField } from 'rn-material-ui-textfield'

import R from '../../res'
import s from './styles'
import { IInputProps } from './types'

const Input = (props: IInputProps) => {
  const { id, value, onTextChanged, onChangeText, reference, label, styles } =
    props
  const mainColor = styles?.baseColor
    ? styles.baseColor
    : styles?.color || R.colors.black

  return (
    <View style={[s.container, styles?.container]}>
      <TextField
        inputRef={reference}
        value={value}
        onChangeText={(text: string) =>
          id && onTextChanged ? onTextChanged(id, text) : onChangeText
        }
        {...props}
        label={label}
        tintColor={mainColor}
        containerStyle={[s.fieldWrapper, styles?.fieldWrapper]}
        baseColor={mainColor}
        activeLineWidth={styles?.activeLineWidth || 2}
        lineWidth={styles?.lineWidth || 1}
        textContentType={props.isSecure ? 'oneTimeCode' : 'none'}
        autoCorrect={false}
        style={styles?.input}
        errorColor={styles?.errorColor}
      />
    </View>
  )
}

export default Input
