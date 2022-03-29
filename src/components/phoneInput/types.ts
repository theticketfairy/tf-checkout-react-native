import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IInputStyles } from '../input/types'

export interface IPhoneInputProps {
  phoneNumber: string
  onChangePhoneNumber: (phoneNumber: string) => void
  isPickerVisible: boolean
  country?: IPhoneCountry
  onChangePickerVisibility: (isVisible: boolean) => void
  onSelectCountry: (country: IPhoneCountry) => void
  styles?: IPhoneInputStyles
  error?: string
  texts?: IPhoneInputTexts
}

export interface IPhoneInputTexts {
  label?: string
  countrySearchPlaceholder?: string
  errors?: {
    emptyCountryCode?: string
    emptyPhoneNumber?: string
    invalidPhoneNumber?: string
  }
}

export interface IPhoneInputStyles {
  rootContainer?: StyleProp<ViewStyle>
  country?: {
    container?: StyleProp<ViewStyle>
    button?: StyleProp<ViewStyle>
    flag?: StyleProp<TextStyle>
    code?: StyleProp<TextStyle>
  }
  input?: IInputStyles
  modal?: {
    // Styles for whole modal [View]
    modal?: StyleProp<ViewStyle>
    // Styles for added space for KeyboardAvoidView [View]
    modalInner?: StyleProp<ViewStyle>
    // Styles for modal backdrop [View]
    backdrop?: StyleProp<ViewStyle>
    // Styles for bottom input line [View]
    line?: StyleProp<ViewStyle>
    // Styles for list of countries [FlatList]
    itemsList?: StyleProp<ViewStyle>
    // Styles for input [TextInput]
    textInput?: StyleProp<TextStyle>
    // Styles for country button [TouchableOpacity]
    countryButtonStyles?: StyleProp<ViewStyle>
    // Styles for search message [Text]
    searchMessageText?: StyleProp<TextStyle>
    // Styles for search message container [View]
    countryMessageContainer?: StyleProp<ViewStyle>
    // Flag styles [Text]
    flag?: StyleProp<TextStyle>
    // Dial code styles [Text]
    dialCode?: StyleProp<TextStyle>
    // Country name styles [Text]
    countryName?: StyleProp<TextStyle>
  }
}

export interface IPhoneCountry {
  code: string
  dial_code: string
  flag: string
  name: {
    by: string
    cz: string
    en: string
    pl: string
    pt: string
    ru: string
    ua: string
  }
}
