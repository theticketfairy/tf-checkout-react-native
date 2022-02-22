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
  })

  const { someoneData } = sellToWhomData

  const firstNameError = useDebounced(someoneData.firstName, validateEmpty)
  const lastNameError = useDebounced(someoneData.lastName, validateEmpty)
  const emailError = useDebounced(someoneData.email, () =>
    validateEmail(someoneData.email, someoneData.emailConfirm)
  )
  const emailConfirmError = useDebounced(someoneData.emailConfirm, () =>
    validateEmail(someoneData.emailConfirm, someoneData.email)
  )

  const handleOnPressSellTickets = () => {
    console.log('handleOnPressSellTickets')
  }

  const handleSellToWhomDataChange = (
    id: SellToWhomFieldIdEnum,
    value: string | number
  ) => {
    switch (id) {
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
            ...someoneData,
            firstName: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.lastName:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...someoneData,
            lastName: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.email:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...someoneData,
            email: value as string,
          },
        })
        break
      case SellToWhomFieldIdEnum.emailConfirm:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...someoneData,
            emailConfirm: value as string,
          },
        })
        break
    }
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
      isDataValid={
        !firstNameError &&
        !lastNameError &&
        !emailError &&
        !emailConfirmError &&
        !!sellToWhomData.toWhom
      }
      onSellToWhomDataChanged={handleSellToWhomDataChange}
      onPressSellTickets={handleOnPressSellTickets}
      ticket={ticket}
    />
  )
}

export default ResaleTickets
