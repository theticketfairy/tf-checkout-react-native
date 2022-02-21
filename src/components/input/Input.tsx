import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { OutlinedTextField as TextField } from 'rn-material-ui-textfield'

import { Config } from '../../helpers/Config'
import R from '../../res'
import s from './styles'
import { IInputProps } from './types'

const Input = (props: IInputProps) => {
  const {
    id,
    value,
    onTextChanged,
    onChangeText,
    reference,
    label,
    styles,
    error,
    isSecure,
  } = props
  const mainColor = styles?.baseColor
    ? styles.baseColor
    : styles?.color || R.colors.black
  return (
    <View style={[s.container, styles?.container]}>
      {Config.IS_INPUT_MATERIAL ? (
        <TextField
          //@ts-ignore
          inputRef={reference}
          value={value}
          onChangeText={(text: string) =>
            id && onTextChanged ? onTextChanged(id, text) : onChangeText
          }
          {...props}
          label={label}
          tintColor={mainColor}
          containerStyle={s.fieldWrapper}
          baseColor={mainColor}
          activeLineWidth={styles?.activeLineWidth || 2}
          lineWidth={styles?.lineWidth || 1}
          textContentType={isSecure ? 'oneTimeCode' : 'none'}
          autoCorrect={false}
          style={styles?.input}
          errorColor={styles?.errorColor}
        />
      ) : (
        <View style={[{ flex: 1 }, styles?.content]}>
          <Text style={[{ color: 'white', marginBottom: 4 }, styles?.label]}>
            {label}
          </Text>
          <TextInput
            style={[
              { backgroundColor: 'white', flex: 1, height: 40 },
              styles?.input,
            ]}
            underlineColorAndroid='transparent'
            {...props}
          />
          {!!error && (
            <Text style={[{ color: 'red' }, styles?.error]}>{error}</Text>
          )}
        </View>
      )}
    </View>
  )
}

export default Input
