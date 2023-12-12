import React from 'react'
import { FlatList, SectionList, Text, View } from 'react-native'

import {
  EnterPassword,
  Loading,
  LoggedIn,
  PromoCode,
  WaitingList,
} from '../../components'
import Button from '../../components/button/Button'
import Separator from '../../components/separator/Separator'
import { Config } from '../../helpers/Config'
import TicketGroupListHeader from './components/TicketGroupListHeader'
import CartListItem from './components/TicketListItem'
import s from './styles'
import type { ITicketsViewProps } from './types'

const TicketsView = ({
  isGettingTickets,
  tickets,
  groupedTickets,
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
  areTicketsGroupsShown,
  passwordProtectedEventData,
  onPressSubmitEventPassword,
  arePromoCodesEnabled,
}: ITicketsViewProps) => {
  const isButtonDisabled =
    !selectedTicket || selectedTicket.selectedOption?.value === 0
  const buttonText = texts?.getTicketsButton
    ? texts.getTicketsButton
    : isButtonDisabled
    ? 'Get tickets'
    : `Get ${selectedTicket?.selectedOption?.value} tickets`
  const title = texts?.title ? texts.title : 'GET TICKETS'

  return passwordProtectedEventData?.isPasswordProtected ? (
    <EnterPassword
      onSubmit={onPressSubmitEventPassword}
      styles={styles?.enterPassword}
      texts={texts?.enterPassword}
      isLoading={passwordProtectedEventData?.isLoading}
      apiError={passwordProtectedEventData?.apiError}
    />
  ) : (
    <View style={[s.container, styles?.rootContainer]}>
      <View style={[s.container, styles?.container]}>
        <View style={s.header}>
          <Text style={[s.headerText, styles?.title]}>{title}</Text>
        </View>
        {arePromoCodesEnabled && (
          <PromoCode
            onPressApply={onPressApplyPromoCode}
            promoCodeValidationMessage={promoCodeValidationMessage}
            isPromoCodeValid={isPromoCodeValid}
            isAccessCodeEnabled={isAccessCodeEnabled}
            styles={styles?.promoCode}
            texts={texts?.promoCode}
            closeButtonIcon={promoCodeCloseIcon}
          />
        )}
        {areTicketsGroupsShown ? (
          <SectionList
            sections={groupedTickets}
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
            renderSectionHeader={(data) => (
              <TicketGroupListHeader
                text={data.section.title}
                styles={{
                  container: styles?.ticketList?.sectionHeader?.container,
                  text: styles?.ticketList?.sectionHeader?.title,
                }}
              />
            )}
          />
        ) : (
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
            // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => <Separator />}
          />
        )}
        {isWaitingListVisible && event?.salesStarted && (
          <WaitingList
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
        <View style={s.configContainer}>
          <Text>Config - </Text>
          <Text>EVENT ID: {Config.EVENT_ID} </Text>
          <Text>CLIENT: {Config.CLIENT} </Text>
          <Text>BRAND: {Config.BRAND} </Text>
          <Text>ENV: {Config.ENV} </Text>
        </View>
      </View>
    </View>
  )
}

export default TicketsView
