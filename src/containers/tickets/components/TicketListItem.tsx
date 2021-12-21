import _has from 'lodash/has'
import React from 'react'
import { Text, View } from 'react-native'

import { Dropdown } from '../../../components'
import { IDropdownItem } from '../../../components/dropdown/types'
import { priceWithCurrency } from '../../../helpers/StringsHelper'
import { CartListItemStyles as s } from './styles'
import { ITicketListItemProps } from './types'

const TicketListItem = ({
  ticket,
  ticketNumber,
  onSelectTicketItem,
  selectedTicket,
  styles,
  texts,
}: ITicketListItemProps) => {
  console.log('TICKET', ticket)
  const isSoldOut = ticket.sold_out || !ticket.displayTicket || ticket.soldOut
  const isSalesClosed =
    !ticket.salesStarted || ticket.salesEnded || !_has(ticket, 'maxQuantity')
  const customSoldOutMessage = texts?.soldOut ? texts.soldOut : 'SOLD OUT'
  const soldOutMessage = ticket.soldOutMessage
    ? `${ticket.soldOutMessage}`.toUpperCase()
    : customSoldOutMessage

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

  const handleOnSelectItem = (item: IDropdownItem) => {
    onSelectTicketItem({ ...ticket, selectedOption: item })
  }

  const selectedOption: IDropdownItem =
    selectedTicket &&
    ticket.id === selectedTicket.id &&
    selectedTicket.selectedOption
      ? selectedTicket.selectedOption
      : { label: '0', value: 0 }

  const taxText =
    ticket.feeText || ticket.feeIncluded ? '(incl. Fees)' : '(excl. Fees)'

  const showOldPrice = ticket.price !== ticket.oldPrice

  return (
    <View style={[s.container, styles?.container]}>
      <View style={s.leftContainer}>
        <Text style={[s.ticketNumber, styles?.ticketName]} numberOfLines={2}>
          {ticket.displayName.toUpperCase() || `TICKET ${ticketNumber}`}
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
              <Text style={[s.price, styles?.price]}>
                {priceWithCurrency(ticket.price.toString(), ticket.priceSymbol)}
              </Text>
            </View>
            <Text style={[s.tax, styles?.fees]}>{taxText.toUpperCase()}</Text>
          </>
        )}
      </View>
      {!isSalesClosed && !isSoldOut && (
        <View style={s.rightContainer}>
          <Dropdown
            items={getSelectOptions(
              ticket.maxQuantity,
              ticket.minQuantity,
              ticket.multiplier
            )}
            selectedOption={selectedOption}
            onSelectItem={handleOnSelectItem}
            styles={styles?.dropdown}
          />
        </View>
      )}
    </View>
  )
}

export default TicketListItem
