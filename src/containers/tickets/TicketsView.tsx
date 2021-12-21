import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Loading, PromoCode } from '../../components'
import Button from '../../components/button/Button'
import Separator from '../../components/separator/Separator'
import CartListItem from './components/TicketListItem'
import s from './styles'
import { ITicketsViewProps } from './types'

const TicketsView = ({
  isGettingTickets,
  tickets,
  styles,
  onPressGetTickets,
  onPressApplyPromoCode,
  promoCodeValidationMessage,
  isPromoCodeValid,
  onSelectTicketOption,
  selectedTicket,
  isBookingTickets,
  texts,
}: ITicketsViewProps) => {
  const isButtonDisabled =
    !selectedTicket || selectedTicket.selectedOption?.value === 0
  const buttonText = isButtonDisabled
    ? 'Get tickets'
    : `Get ${selectedTicket?.selectedOption?.value} tickets`
  const title = texts?.title ? texts.title : 'GET TICKETS'

  return (
    <KeyboardAwareScrollView>
      <View style={[s.container, styles?.container]}>
        <View style={s.header}>
          <Text style={[s.headerText, styles?.title]}>{title}</Text>
        </View>
        <FlatList
          data={tickets}
          style={styles?.ticketList?.listContainer}
          keyExtractor={(item) => `ticket.${item.id}`}
          renderItem={({ item, index }) => (
            <CartListItem
              onSelectTicketItem={onSelectTicketOption}
              ticket={item}
              ticketNumber={index}
              selectedTicket={selectedTicket}
              styles={styles?.ticketList?.item}
              {...item}
            />
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
        <PromoCode
          onPressApply={onPressApplyPromoCode}
          promoCodeValidationMessage={promoCodeValidationMessage}
          isPromoCodeValid={isPromoCodeValid}
          styles={styles?.promoCode}
          texts={texts?.promoCode}
        />
        <Button
          text={buttonText}
          onPress={onPressGetTickets}
          isUpperCase={true}
          isLoading={isBookingTickets}
          isDisabled={isButtonDisabled}
          styles={{
            container: styles?.getTicketsButton,
            text: styles?.getTicketText,
          }}
        />
        {isGettingTickets && <Loading />}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default TicketsView
