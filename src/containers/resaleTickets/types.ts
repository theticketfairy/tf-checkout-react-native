import { StyleProp, Text, TextStyle, ViewStyle } from 'react-native'

import { IMyOrderDetailsTicket } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import { ICheckboxStyles } from '../../components/checkbox/types'
import { IInputStyles } from '../../components/input/types'
import { IRadioButtonStyles } from '../../components/radioButton/types'

//#region Order Details
export interface ITicketOrderDetailsStyles {
  title?: StyleProp<TextStyle>
  label?: StyleProp<TextStyle>
  value?: StyleProp<TextStyle>
  rootContainer?: StyleProp<ViewStyle>
}

export interface ITicketOrderDetailsProps {
  styles?: ITicketOrderDetailsStyles
}
//#endregion

//#region Ticket Buyer Form
export interface ITicketBuyerFormStyles {
  rootContainer?: StyleProp<ViewStyle>
  radioButtons?: IRadioButtonStyles
  inputs?: IInputStyles
  title?: StyleProp<TextStyle>
  formContainer?: StyleProp<ViewStyle>
}

export interface ISellTicketsFormData {
  firstName: string
  lastName: string
  email: string
  emailConfirm: string
}

export interface ISellTicketsFormDataErrors {
  firstNameError?: string
  lastNameError?: string
  emailError?: string
  emailConfirmError?: string
}

export interface ISellToWhomData {
  toWhom: 'friend' | 'anyone' | undefined
  someoneData: ISellTicketsFormData
  isTermsAgreed: boolean
}
export interface ITicketBuyerFormProps {
  isDataValid?: boolean
  styles?: ITicketBuyerFormStyles
}
//#endregion

//#region Resale Terms
export interface IResaleTermsStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  item?: StyleProp<TextStyle>
  itemBold?: StyleProp<TextStyle>
}

export interface IResaleTermsProps {
  styles?: IResaleTermsStyles
  terms: string[] | Text[]
}
//#endregion

//-----------------------------------------------------------------------------

export interface IResaleTicketsStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  terms?: IResaleTermsStyles
  sellTicketsButton?: IButtonStyles
  sellTicketsButtonDisabled?: IButtonStyles
  sellTicketsButtonLoading?: IButtonStyles
  ticketOrderDetails?: ITicketOrderDetailsStyles
  ticketBuyerForm?: ITicketBuyerFormStyles
  termsCheckbox?: ICheckboxStyles
}

export interface IResaleTicketsProps {
  ticket: IMyOrderDetailsTicket
  styles?: IResaleTicketsStyles
  onSellTicketsSuccess: (ticket: IMyOrderDetailsTicket) => void
  onSellTicketsFail?: (errorMessage: string) => void
}

export interface IResaleTicketsViewTexts {
  title?: string
}

// eslint-disable-next-line no-shadow
export enum SellToWhomFieldIdEnum {
  firstName,
  lastName,
  email,
  emailConfirm,
  radioIndex,
  terms,
}

export interface IResaleTicketsViewProps {
  isLoading?: boolean
  someoneDataErrors: ISellTicketsFormDataErrors
  sellToWhomData: ISellToWhomData
  onSellToWhomDataChanged: (
    id: SellToWhomFieldIdEnum,
    value?: string | number
  ) => void
  isDataValid?: boolean
  isSomeoneDataValid?: boolean
  styles?: IResaleTicketsStyles
  texts?: IResaleTicketsViewTexts
  onPressSellTickets: () => void
  ticket: IMyOrderDetailsTicket
}
