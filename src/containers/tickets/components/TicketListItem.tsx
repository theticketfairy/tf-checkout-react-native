import _maxBy from 'lodash/maxBy'
import React from 'react'
import { Text, View } from 'react-native'

import { Dropdown } from '../../../components'
import type { IDropdownItem } from '../../../components/dropdown/types'
import { priceWithCurrency } from '../../../helpers/StringsHelper'
import { CartListItemStyles as s } from './styles'
import type { ITicketListItemProps } from './types'



const TicketListItem = ({
  ticket,
  ticketNumber,
  onSelectTicketItem,
  selectedTicket,
  styles,
  texts,
}: ITicketListItemProps) => {
  const soldOutText = texts?.soldOut || 'SOLD OUT'
  const salesNotStartedText = texts?.salesNotStarted || 'Sales not started'
  const salesEnded = texts?.salesEnded || 'Sales ended'
  const feesIncludedText = texts?.inclFees || '(incl. Fees)'
  const feesExcludedText = texts?.exclFees || '(excl. Fees)'
  const freeText = texts?.free || 'Free'
  const ticketText = texts?.ticket || 'Ticket'
  const isSoldOut = ticket.sold_out || !ticket.displayTicket || ticket.soldOut
  const isSalesClosed = !ticket.salesStarted || ticket.salesEnded
  const customSoldOutMessage = texts?.soldOut || 'SOLD OUT'
  const soldOutMessage = ticket.soldOutMessage
    ? `${ticket.soldOutMessage}`.toUpperCase()
    : customSoldOutMessage

  const ticketsClosedMessage = !ticket.salesStarted
    ? salesNotStartedText
    : salesEnded

  const getSelectOptions = (
    maxCount: number = 10,
    minCount: number = 1,
    multiplier: number = 1
  ) => {
    const options = [{ label: '0', value: 0 }]
    for (let i = minCount; i <= Math.min(50, maxCount); i += multiplier) {
      options.push({ label: i.toString(), value: i })
    }
    return options
  }

  const dropdownOptions = getSelectOptions(
    ticket.maxQuantity,
    ticket.minQuantity,
    ticket.multiplier
  )

  const handleOnSelectItem = (item: IDropdownItem) => {
    onSelectTicketItem({ ...ticket, selectedOption: item })
  }

  const selectedOption: IDropdownItem =
    selectedTicket &&
    ticket.id === selectedTicket.id &&
    selectedTicket.selectedOption
      ? selectedTicket.selectedOption
      : { label: '0', value: 0 }

  const feesIncluded = ticket.feeIncluded ? feesIncludedText : feesExcludedText
  const showOldPrice = ticket.price !== ticket.oldPrice
  const isTicketFree = +ticket.price === 0
  const ticketPrice = isSoldOut
    ? soldOutText
    : isTicketFree
    ? freeText
    : priceWithCurrency(ticket.price.toFixed(2).toString(), ticket.priceSymbol)

  const maximumOption = _maxBy(dropdownOptions, (o) => o.value)?.value

  let rightContent = <></>

  if (ticket.soldOut || ticket.sold_out || !ticket.displayTicket) {
    rightContent = <Text>{soldOutMessage}</Text>
  }
  if (ticket.displayTicket) {
    rightContent = isSalesClosed ? (
      <Text>{ticketsClosedMessage}</Text>
    ) : maximumOption && maximumOption > 0 ? (
      <Dropdown
        items={dropdownOptions}
        selectedOption={selectedOption}
        onSelectItem={handleOnSelectItem}
        styles={styles?.dropdown}
      />
    ) : (
      <></>
    )
  }

  return (
    <View style={[s.container, styles?.container]}>
      <View style={s.leftContainer}>
        <Text style={[s.ticketNumber, styles?.ticketName]} numberOfLines={2}>
          {ticket.displayName.toUpperCase() || `${ticketText} ${ticketNumber}`}
        </Text>
        {isSoldOut ? (
          <View style={[s.soldOutContainer, styles?.soldOutContainer]}>
            <Text style={[s.soldOut, styles?.soldOutText]}>
              {soldOutMessage}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles?.pricesContainer}>
              {showOldPrice && (
                <Text style={[s.oldPrice, styles?.oldPrice]}>
                  {priceWithCurrency(
                    ticket.oldPrice?.toString(),
                    ticket.priceSymbol
                  )}
                </Text>
              )}
              <Text style={[s.price, styles?.price]}>{ticketPrice}</Text>
            </View>
            <Text style={[s.tax, styles?.fees]}>
              {feesIncluded.toUpperCase()}
            </Text>
          </>
        )}
      </View>
      {!isSalesClosed && !isSoldOut && (
        <View style={s.rightContainer}>{rightContent}</View>
      )}
    </View>
  )
}

export default TicketListItem
