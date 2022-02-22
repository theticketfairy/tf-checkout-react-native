import React, { FC, useState } from 'react'

import { useDebounced } from '../../helpers/Debounced'
import { validateEmail, validateEmpty } from '../../helpers/Validators'
import ResaleTicketsView from './ResaleTicketsView'
import {
  IResaleTicketsProps,
  ISellToWhomData,
  SellToWhomFieldIdEnum,
} from './types'

const ResaleTickets: FC<IResaleTicketsProps> = ({ styles, ticket }) => {
  console.log('TICKET', ticket)
  const [isLoading, setIsLoading] = useState(false)
  const [sellToWhomData, setSellToWhomData] = useState<ISellToWhomData>({
    toWhom: undefined,
    someoneData: {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirm: '',
    },
    isTermsAgreed: false,
  })

  const {
    someoneData: { firstName, lastName, email, emailConfirm },
    isTermsAgreed,
    toWhom,
  } = sellToWhomData

  const firstNameError = useDebounced(firstName, validateEmpty)
  const lastNameError = useDebounced(lastName, validateEmpty)
  const emailError = useDebounced(email, () =>
    validateEmail(email, emailConfirm)
  )
  const emailConfirmError = useDebounced(emailConfirm, () =>
    validateEmail(emailConfirm, email)
  )

  const handleOnPressSellTickets = () => {
    console.log('handleOnPressSellTickets')
  }

  const handleSellToWhomDataChange = (
    id: SellToWhomFieldIdEnum,
    value?: string | number
  ) => {
    switch (id) {
      case SellToWhomFieldIdEnum.terms:
        setSellToWhomData({
          ...sellToWhomData,
          isTermsAgreed: !isTermsAgreed,
        })
        break
      case SellToWhomFieldIdEnum.radioIndex:
        setSellToWhomData({
          ...sellToWhomData,
          toWhom: value === 0 ? 'someone' : 'anyone',
        })
        break
      case SellToWhomFieldIdEnum.firstName:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            firstName: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.lastName:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            lastName: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.email:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            email: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.emailConfirm:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            emailConfirm: value as string,
          },
        })
        break
    }
  }

  const isDataValid = () => {
    if (toWhom === 'anyone' && isTermsAgreed) {
      return true
    }
    if (
      toWhom === 'someone' &&
      firstName &&
      lastName &&
      email &&
      emailConfirm &&
      !emailConfirmError &&
      !emailError &&
      !firstNameError &&
      !lastNameError &&
      isTermsAgreed
    ) {
      return true
    }

    return false
  }

  return (
    <ResaleTicketsView
      styles={styles}
      isLoading={isLoading}
      sellToWhomData={sellToWhomData}
      someoneDataErrors={{
        firstNameError: firstNameError,
        lastNameError: lastNameError,
        emailError: emailError,
        emailConfirmError: emailConfirmError,
      }}
      isDataValid={isDataValid()}
      onSellToWhomDataChanged={handleSellToWhomDataChange}
      onPressSellTickets={handleOnPressSellTickets}
      ticket={ticket}
    />
  )
}

export default ResaleTickets
