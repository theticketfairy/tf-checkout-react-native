import { StyleProp, Text, TextStyle, ViewStyle } from 'react-native'

import { IMyOrderDetailsTicket, IResaleTicketData } from '../../api/types'
import { IButtonStyles } from '../../components/button/types'
import { ICheckboxStyles } from '../../components/checkbox/types'
import { IInputStyles } from '../../components/input/types'
import { IRadioButtonStyles } from '../../components/radioButton/types'
import { IError } from '../../types'

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

export interface IResaleTicketsFormData {
  firstName: string
  lastName: string
  email: string
  emailConfirm: string
}

export interface IResaleTicketsFormDataErrors {
  firstNameError?: string
  lastNameError?: string
  emailError?: string
  emailConfirmError?: string
}

export interface IResaleToWhomData {
  toWhom: 'friend' | 'anyone' | undefined
  someoneData: IResaleTicketsFormData
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

export interface IResaleTicketsStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  terms?: IResaleTermsStyles
  resaleTicketsButton?: IButtonStyles
  resaleTicketsButtonDisabled?: IButtonStyles
  resaleTicketsButtonLoading?: IButtonStyles
  ticketOrderDetails?: ITicketOrderDetailsStyles
  ticketBuyerForm?: ITicketBuyerFormStyles
  termsCheckbox?: ICheckboxStyles
}

export interface IResaleTicketsProps {
  ticket: IMyOrderDetailsTicket
  styles?: IResaleTicketsStyles
  onResaleTicketsSuccess: (
    resaleTicketData: IResaleTicketData,
    ticket: IMyOrderDetailsTicket
  ) => void
  onResaleTicketsError?: (error: IError) => void
  config?: {
    areAlertsEnabled?: boolean
    areActivityIndicatorsEnabled?: boolean
  }
  texts?: IResaleTicketsViewTexts
}

export interface IResaleTicketsViewTexts {
  title?: string
  orderDetails?: {
    title?: string
    eventName?: string
    orderedBy?: string
    orderId?: string
  }
  sellToWhom?: {
    title?: string
    friend?: string
    anyone?: string
  }
  friendForm?: {
    firstName?: string
    lastName?: string
    email?: string
    emailConfirm?: string
  }
  terms?: {
    title?: string
    paragraph1?: string
    paragraph2_1?: string
    paragraph2_2?: string
    paragraph3_1?: string
    paragraph3_2?: string
  }
  agree?: string
  resaleTicketsButton?: string
}

// eslint-disable-next-line no-shadow
export enum ResaleToWhomFieldIdEnum {
  firstName,
  lastName,
  email,
  emailConfirm,
  radioIndex,
  terms,
}

export interface IResaleTicketsViewProps {
  isLoading?: boolean
  someoneDataErrors: IResaleTicketsFormDataErrors
  resaleToWhomData: IResaleToWhomData
  onResaleToWhomDataChanged: (
    id: ResaleToWhomFieldIdEnum,
    value?: string | number
  ) => void
  isDataValid?: boolean
  isSomeoneDataValid?: boolean
  styles?: IResaleTicketsStyles
  texts?: IResaleTicketsViewTexts
  onPressResaleTickets: () => void
  ticket: IMyOrderDetailsTicket
}
