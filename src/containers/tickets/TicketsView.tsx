import React from 'react'
import { FlatList, Text, View } from 'react-native'

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
  areLoadingIndicatorsEnabled,
  onAddToWaitingListError,
  onAddToWaitingListSuccess,
  onLoadingChange,
  areAlertsEnabled,
  promoCodeCloseIcon,
}: ITicketsViewProps) => {
  const isButtonDisabled =
    !selectedTicket || selectedTicket.selectedOption?.value === 0
  const buttonText = texts?.getTicketsButton
    ? texts.getTicketsButton
    : isButtonDisabled
    ? 'Get tickets'
    : `Get ${selectedTicket?.selectedOption?.value} tickets`
  const title = texts?.title ? texts.title : 'GET TICKETS'

  return (
    <View style={[s.container, styles?.rootContainer]}>
      <View style={[s.container, styles?.container]}>
        <View style={s.header}>
          <Text style={[s.headerText, styles?.title]}>{title}</Text>
        </View>
        <PromoCode
          onPressApply={onPressApplyPromoCode}
          promoCodeValidationMessage={promoCodeValidationMessage}
          isPromoCodeValid={isPromoCodeValid}
          isAccessCodeEnabled={isAccessCodeEnabled}
          styles={styles?.promoCode}
          texts={texts?.promoCode}
          closeButtonIcon={promoCodeCloseIcon}
        />
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
              texts={texts?.listItem}
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
            onAddToWaitingListSuccess={onAddToWaitingListSuccess}
            onAddToWaitingListError={onAddToWaitingListError}
            onLoadingChange={onLoadingChange}
            areAlertsEnabled={areAlertsEnabled}
          />
        )}

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
            texts={texts?.loggedInTexts}
            onPressLogout={onPressLogout}
          />
        )}
        {(isGettingTickets || isGettingEvent) &&
          areLoadingIndicatorsEnabled && <Loading />}
      </View>
    </View>
  )
}

export default TicketsView
