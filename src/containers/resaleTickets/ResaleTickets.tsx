import React, { FC, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { OrderDetailsCore, OrderDetailsCoreHandle } from '../../core'
import { useDebounced } from '../../helpers/Debounced'
import { validateEmail, validateEmpty } from '../../helpers/Validators'
import ResaleTicketsView from './ResaleTicketsView'
import {
  IResaleTicketsProps,
  IResaleToWhomData,
  ResaleToWhomFieldIdEnum,
} from './types'

const sellToWhomInitialData: IResaleToWhomData = {
  toWhom: undefined,
  someoneData: {
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
  },
  isTermsAgreed: false,
}

const ResaleTickets: FC<IResaleTicketsProps> = ({
  styles,
  ticket,
  onResaleTicketsSuccess,
  onResaleTicketsError,
  config = {
    areActivityIndicatorsEnabled: true,
    areAlertsEnabled: true,
  },
  isTicketTypeActive,
}) => {
  //#region refs
  const orderDetailsCoreRef = useRef<OrderDetailsCoreHandle>(null)
  //#endregion

  //#region state
  const [isLoading, setIsLoading] = useState(false)
  const [sellToWhomData, setSellToWhomData] = useState<IResaleToWhomData>(
    sellToWhomInitialData
  )

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
  //#endregion

  const showAlert = (message: string) => {
    if (config?.areAlertsEnabled) {
      Alert.alert('', message)
    }
  }

  //#region handlers
  const handleOnPressSellTickets = async () => {
    if (!orderDetailsCoreRef.current) {
      showAlert('ResaleTicketsCoreRef is not initialized')
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('to', toWhom)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('email', email)
    formData.append('confirm_email', emailConfirm)
    formData.append('confirm', String(isTermsAgreed))

    const { resaleTicketData, resaleTicketError } =
      await orderDetailsCoreRef.current!.resaleTicket(formData, ticket.hash)

    setIsLoading(false)

    if (resaleTicketError || !resaleTicketData) {
      onResaleTicketsError?.(resaleTicketError!)
      return showAlert(resaleTicketError!.message)
    }

    showAlert(resaleTicketData.message)

    return onResaleTicketsSuccess(resaleTicketData, {
      ...ticket,
      isOnSale: true,
      isSellable: false,
    })
  }

  const handleSellToWhomDataChange = (
    id: ResaleToWhomFieldIdEnum,
    value?: string | number
  ) => {
    switch (id) {
      case ResaleToWhomFieldIdEnum.terms:
        setSellToWhomData({
          ...sellToWhomData,
          isTermsAgreed: !isTermsAgreed,
        })
        break
      case ResaleToWhomFieldIdEnum.radioIndex:
        setSellToWhomData({
          ...sellToWhomData,
          toWhom: value === 0 ? 'friend' : 'anyone',
        })
        break
      case ResaleToWhomFieldIdEnum.firstName:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            firstName: value as string,
          },
        })
        break
      case ResaleToWhomFieldIdEnum.lastName:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            lastName: value as string,
          },
        })
        break
      case ResaleToWhomFieldIdEnum.email:
        setSellToWhomData({
          ...sellToWhomData,
          someoneData: {
            ...sellToWhomData.someoneData,
            email: value as string,
          },
        })
        break
      case ResaleToWhomFieldIdEnum.emailConfirm:
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
  //#endregion

  //#region data validation
  const isDataValid = () => {
    if (toWhom === 'anyone' && isTermsAgreed) {
      return true
    }
    if (
      toWhom === 'friend' &&
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
  //#endregion

  //#region render
  return (
    <OrderDetailsCore ref={orderDetailsCoreRef}>
      <ResaleTicketsView
        styles={styles}
        isLoading={isLoading}
        resaleToWhomData={sellToWhomData}
        someoneDataErrors={{
          firstNameError: firstNameError,
          lastNameError: lastNameError,
          emailError: emailError,
          emailConfirmError: emailConfirmError,
        }}
        isDataValid={isDataValid()}
        onResaleToWhomDataChanged={handleSellToWhomDataChange}
        onPressResaleTickets={handleOnPressSellTickets}
        ticket={ticket}
        isTicketsTypeActive={isTicketTypeActive}
      />
    </OrderDetailsCore>
  )
  //#endregion
}

export default ResaleTickets
