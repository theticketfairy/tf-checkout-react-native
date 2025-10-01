import { LegacyRef } from 'react';
import {
  ColorValue,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput,
} from 'react-native';
import TextField, { TextFieldProps } from '../../packages/rn-material-ui-textfield';

export interface IInputStyles {
  color?: ColorValue;
  container?: StyleProp<ViewStyle>;
  input?: StyleProp<TextStyle>;
  lineWidth?: number;
  activeLineWidth?: number;
  baseColor?: ColorValue;
  errorColor?: ColorValue;
  fieldWrapper?: StyleProp<ViewStyle>;
  showPasswordIcon?: StyleProp<ImageStyle>;
  placeholderColor?: ColorValue;
}

export interface IInputProps extends TextFieldProps {
  isSecure?: boolean;
  reference?: LegacyRef<TextField>;
  id?: string;
  onTextChanged?: (key: string, value: string) => void;

  styles?: IInputStyles;
  isShowPasswordButtonVisible?: boolean;
  showPasswordImages?: {
    show: ImageSourcePropType;
    hide: ImageSourcePropType;
  };
}
