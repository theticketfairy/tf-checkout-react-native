import { Component, ReactElement } from 'react';
import {
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
} from 'react-native';

export interface TextFieldProps extends TextInputProps {
  animationDuration?: number;
  fontSize?: number;
  labelFontSize?: number;
  contentInset?: {
    top?: number;
    label?: number;
    input?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  labelOffset?: {
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
  };
  labelTextStyle?: StyleProp<TextStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  affixTextStyle?: StyleProp<TextStyle>;
  tintColor?: string;
  textColor?: string;
  baseColor?: string;
  label?: string;
  title?: string;
  characterRestriction?: number;
  error?: string;
  errorColor?: string;
  lineWidth?: number;
  activeLineWidth?: number;
  disabledLineWidth?: number;
  lineType?: 'solid' | 'dotted' | 'dashed' | 'none';
  disabledLineType?: 'solid' | 'dotted' | 'dashed' | 'none';
  disabled?: boolean;
  formatText?: (text: string) => string;
  renderLeftAccessory?: () => ReactElement | null;
  renderRightAccessory?: () => ReactElement | null;
  prefix?: string;
  suffix?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputRef?: React.RefObject<TextInput>;
}

export class TextField extends Component<TextFieldProps> {}
export class FilledTextField extends Component<TextFieldProps> {}
export class OutlinedTextField extends Component<TextFieldProps> {}

export { TextField as default };
