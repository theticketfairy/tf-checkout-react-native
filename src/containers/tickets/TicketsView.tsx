import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Loading, LoggedIn, PromoCode, WaitingList } from '../../components'
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
  isGettingEvent,
  event,
  isWaitingListVisible,
  isGetTicketsButtonVisible,
  eventId,
  isAccessCodeEnabled,
  isUserLogged,
  onPressMyOrders,
  onPressLogout,
}: ITicketsViewProps) => {
  const isButtonDisabled =
    !selectedTicket || selectedTicket.selectedOption?.value === 0
  const buttonText = isButtonDisabled
    ? 'Get tickets'
    : `Get ${selectedTicket?.selectedOption?.value} tickets`
  const title = texts?.title ? texts.title : 'GET TICKETS'

  return (
    <KeyboardAwareScrollView style={[s.container, styles?.rootContainer]}>
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
        {isWaitingListVisible && event?.salesStarted && (
          <WaitingList
            eventId={eventId}
            styles={styles?.waitingList}
            texts={texts?.waitingList}
          />
        )}
        <PromoCode
          onPressApply={onPressApplyPromoCode}
          promoCodeValidationMessage={promoCodeValidationMessage}
          isPromoCodeValid={isPromoCodeValid}
          isAccessCodeEnabled={isAccessCodeEnabled}
          styles={styles?.promoCode}
          texts={texts?.promoCode}
        />
        {isGetTicketsButtonVisible && (
          <Button
            text={buttonText}
            onPress={onPressGetTickets}
            isUpperCase={true}
            isLoading={isBookingTickets}
            isDisabled={isButtonDisabled}
            styles={
              isButtonDisabled
                ? styles?.getTicketsButtonDisabled
                : styles?.getTicketsButtonActive
            }
          />
        )}
        {isUserLogged && (
          <LoggedIn
            onPressMyOrders={onPressMyOrders}
            styles={styles?.loggedIn}
            texts={texts?.loggedIn}
            onPressLogout={onPressLogout}
          />
        )}
        {(isGettingTickets || isGettingEvent) && <Loading />}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default TicketsView
