import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Alert } from 'react-native'

import type { IFetchAccessTokenResponse } from '../../api/types'
import {
  OrderDetailsCore,
  OrderDetailsCoreHandle,
  SessionHandle,
} from '../../core'
import type { SessionHandleType } from '../../core/Session/SessionCoreTypes'
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

const ResaleTickets = forwardRef<SessionHandleType, IResaleTicketsProps>(
  (
    {
      styles,
      ticket,
      onResaleTicketsSuccess,
      onResaleTicketsError,
      config = {
        areActivityIndicatorsEnabled: true,
        areAlertsEnabled: true,
      },
      isTicketTypeActive,
    },
    ref
  ) => {
    //#region refs
    const orderDetailsCoreRef = useRef<OrderDetailsCoreHandle>(null)
    const sessionHandleRef = useRef<SessionHandleType>(null)
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

    //#region Imperative Handler
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken: string
      ): Promise<IFetchAccessTokenResponse> {
        if (!sessionHandleRef.current) {
          return {
            accessTokenError: {
              message: 'Session Handle ref is not initialized',
            },
          }
        }

        const {
          accessTokenError,
          accessTokenData,
        } = await sessionHandleRef.current!.refreshAccessToken(refreshToken)

        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {},
    }))
    //#endregion Imperative Handler

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

      const {
        resaleTicketData,
        resaleTicketError,
      } = await orderDetailsCoreRef.current!.resaleTicket(formData, ticket.hash)

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
        <SessionHandle ref={sessionHandleRef}>
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
        </SessionHandle>
      </OrderDetailsCore>
    )
    //#endregion
  }
)

export default ResaleTickets
