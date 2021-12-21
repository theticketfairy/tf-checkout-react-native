import _forEach from 'lodash/forEach'

import Constants from '../../api/Constants'
import { ICheckoutBody, ICheckoutTicketHolder } from '../../api/types'
import { IUserProfile } from '../../types'
import { IBillingInfoFormData } from './types'

export const formDataInitialState: IBillingInfoFormData = {
  firstName: '',
  lastName: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  phone: '',
  street: '',
  city: '',
  country: undefined,
  zipCode: '',
  state: undefined,
  isSubToNewsletter: false,
  ticketHoldersFields: [],
  isSubToMarketing: false,
  birthday: undefined,
  errors: {
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
  },
}

export const getCheckoutBody = (
  values: IBillingInfoFormData,
  loggedInData?: IUserProfile,
  isAgeRequired: boolean = false
): ICheckoutBody => {
  const parsedTicketHolders: ICheckoutTicketHolder[] =
    values.ticketHoldersFields.map((th) => {
      return {
        email: th.email,
        first_name: th.firstName,
        last_name: th.lastName,
        phone: th.phone,
      }
    })

  const body: ICheckoutBody = {
    attributes: {
      city: values.city,
      confirm_email: values.confirmEmail,
      country: values.country?.value as number,
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      password: values.password,
      phone: values.phone,
      state: values.state?.value as number,
      street_address: values.street,
      zip: values.zipCode,
      ticket_holders: parsedTicketHolders,
      ttf_opt_in: values.isSubToNewsletter,
      brand_opt_in: values.isSubToMarketing,
    },
  }

  if (isAgeRequired && values.birthday) {
    body.attributes.dob_day = values.birthday.getDate()
    body.attributes.dob_month = values.birthday.getMonth() + 1
    body.attributes.dob_year = values.birthday.getFullYear()
  }

  return body
}

export const getRegisterFormData = (checkoutBody: ICheckoutBody): FormData => {
  const bodyFormData = new FormData()
  _forEach(checkoutBody.attributes, (item: any, key: string) => {
    bodyFormData.append(key, item)
  })

  bodyFormData.append('password_confirmation', checkoutBody.attributes.password)
  bodyFormData.append(
    'client_id',
    Constants.CLIENT_ID || 'e9d8f8922797b4621e562255afe90dbf'
  )
  bodyFormData.append(
    'client_secret',
    Constants.CLIENT_SECRET ||
      'b89c191eff22fdcf84ac9bfd88d005355a151ec2c83b26b9'
  )

  return bodyFormData
}
