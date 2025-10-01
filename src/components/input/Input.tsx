//@ts-nocheck

import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import R from '../../res';
import s from './styles';
import { IInputProps } from './types';
import { OutlinedTextField } from '../../packages/rn-material-ui-textfield';

const Input = (props: IInputProps) => {
  const {
    id,
    value,
    onTextChanged,
    onChangeText,
    reference,
    label,
    styles,
    isShowPasswordButtonVisible,
    showPasswordImages,
    secureTextEntry,
  } = props;
  const mainColor = styles?.baseColor
    ? styles.baseColor
    : styles?.color || R.colors.black;

  const showPasswordImage = showPasswordImages?.show || R.icons.eye;
  const hidePasswordImage = showPasswordImages?.hide || R.icons.eyeOff;
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);

  const handleOnPressShowPassword = () => {
    setIsShowingPassword(!isShowingPassword);
  };

  const showPasswordButton = () => {
    return (
      isShowPasswordButtonVisible &&
      secureTextEntry && (
        <TouchableOpacity
          onPress={handleOnPressShowPassword}
          activeOpacity={0.8}
        >
          <Image
            source={isShowingPassword ? hidePasswordImage : showPasswordImage}
            style={[s.showPasswordIcon, styles?.showPasswordIcon]}
          />
        </TouchableOpacity>
      )
    );
  };

  return (
    <View style={[s.container, styles?.container]}>
      <OutlinedTextField
        placeholderTextColor={styles?.placeholderColor}
        // inputRef={reference}
        value={value}
        onChangeText={(text: string) =>
          id && onTextChanged ? onTextChanged(id, text) : onChangeText
        }
        label={label}
        tintColor={mainColor}
        containerStyle={[s.fieldWrapper, styles?.fieldWrapper]}
        baseColor={mainColor}
        activeLineWidth={styles?.activeLineWidth || 1}
        lineWidth={styles?.lineWidth || 1}
        textContentType={props.isSecure ? 'oneTimeCode' : 'none'}
        autoCorrect={false}
        style={styles?.input}
        errorColor={styles?.errorColor}
        secureTextEntry={secureTextEntry && !isShowingPassword}
        renderRightAccessory={showPasswordButton}
        // // 👇 ADDED/MODIFIED LINE: Explicitly set contentInset to ensure alignment
        // // contentInset={{ left: 12, top: 10, label: 4, input: 8, right: 12 }}
        {...props}
      />
    </View>
  );
};

export default Input;