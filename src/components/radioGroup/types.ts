import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface IRadioOption {
  value: string;
  label: string;
}

export interface IRadioGroupStyles {
  container?: StyleProp<ViewStyle>;
  labelText?: StyleProp<TextStyle>;
  errorText?: StyleProp<TextStyle>;
  optionContainer?: StyleProp<ViewStyle>;
  optionText?: StyleProp<TextStyle>;
  radioOuter?: StyleProp<ViewStyle>;
  radioOuterSelected?: StyleProp<ViewStyle>;
  radioInner?: StyleProp<ViewStyle>;
}

export interface IRadioGroupProps {
  options: IRadioOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  label?: string;
  error?: string;
  styles?: IRadioGroupStyles;
}
