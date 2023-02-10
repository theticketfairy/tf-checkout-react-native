import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IAddOnsResponseData } from '../../api/types'

export interface IAddOnsTypes {
  addOnsResponseData: IAddOnsResponseData
  styles?: IAddOnsStyles
  texts?: IAddOnsTexts
}

export interface IAddOnsStyles {
  rootContainer?: StyleProp<ViewStyle>
  headerContainer?: StyleProp<ViewStyle>
  addOnsContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  subTitle?: StyleProp<TextStyle>
  addOnName?: StyleProp<TextStyle>
  addOnPrice?: StyleProp<TextStyle>
  addOnFees?: StyleProp<TextStyle>
}

export interface IAddOnsTexts {
  title?: string
  subTitle?: string
  selectQuantity?: string
}
