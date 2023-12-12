import Clipboard from '@react-native-clipboard/clipboard'
import _map from 'lodash/map'
import React, { FC } from 'react'
import { Image, SectionList, Text, TouchableOpacity, View } from 'react-native'

import type {
  IMyOrderDetailsItem,
  IMyOrderDetailsTicket,
} from '../../api/types'
import { BottomSheetModal, Loading } from '../../components'
import R from '../../res'
import Notification from './components/Notification'
import TicketActions from './components/TicketActions/TicketActions'
import type { TicketActionType } from './components/TicketActions/TicketActionsTypes'
import TicketListItem from './components/TicketListItem/TicketListItem'
import s from './styles'
import type {
  IMyOrderDetailsViewProps,
  IOrderDetailsSectionData,
} from './types'

const MyOrderDetailsView: FC<IMyOrderDetailsViewProps> = ({
  data: { header, items, tickets },
  styles,
  texts,
  isLinkCopied,
  onPressCopyLink,
  downloadStatus,
  config = {
    areActivityIndicatorsEnabled: true,
    areAlertsEnabled: true,
  },
  isLoading,

  onTicketSelection,
  selectedTicket,
  onActionSelected,
  ticketActionsIcons,
  bottomSheetModalRef,
  moreButtonIcon,
}) => {
  //#region Handlers
  const onCopyLinkHandler = () => {
    if (isLinkCopied) {
      return
    }
    Clipboard.setString(header.shareLink)
    onPressCopyLink()
  }

  const handleOnTicketSelection = (ticket: IMyOrderDetailsTicket) => {
    onTicketSelection(ticket)
  }

  const handleHideActionsModal = () => {
    onTicketSelection(undefined)
  }

  const handleOnActionSelected = (actionType: TicketActionType) => {
    onActionSelected(actionType)
  }
  //#endregion

  const copyIconTint = styles?.header?.shareLink?.copyIconTint || R.colors.black
  const copyIconTintActive =
    styles?.header?.shareLink?.copyIconTintActive || R.colors.validGreen
  const title = texts?.title || 'ORDER DETAILS'
  const subTitle = texts?.subTitle || 'ORDER SUMMARY'
  const referralLink =
    texts?.referralLink || 'Your personal share link for this event is:'
  const itemsTotal = texts?.listItem?.total || 'Total'
  const itemsTicketType = texts?.listItem?.ticketType || 'Ticket Type: '
  const itemsPrice = texts?.listItem?.price || 'Price: '
  const itemsQuantity = texts?.listItem?.quantity || 'Quantity: '

  const ticketsTitle = texts?.ticketsTitle || 'Your Tickets: '
  const ticketsId = texts?.ticketItem?.ticketId || 'Ticket ID: '
  const ticketsType = texts?.ticketItem?.ticketType || 'Ticket Type: '
  const ticketsHolderName =
    texts?.ticketItem?.holderName || 'Ticket Holder Name: '
  const ticketsStatus = texts?.ticketItem?.status || 'Status: '
  const copyText = texts?.copyText?.copy || 'Copy'
  const copiedText = texts?.copyText?.copied || 'Copied'

  const soFarText = texts?.referral?.soFar || `So far, you've referred`
  const ticketsText = texts?.referral?.tickets || `tickets.`
  const sellTicket = texts?.sellTicket || 'Sell Ticket'
  const removeTicketFromResale =
    texts?.removeTicketFromResale || 'Remove from resale'
  const download = texts?.ticketItem?.download || `Download`

  const renderShareLink = () => (
    <View style={[s.shareLinkContainer, styles?.header?.shareLink?.container]}>
      <Text
        numberOfLines={1}
        ellipsizeMode='head'
        style={styles?.header?.shareLink?.link}
      >
        {header.shareLink}
      </Text>
      <TouchableOpacity
        style={[s.copyContainer, styles?.header?.shareLink?.copyContainer]}
        onPress={onCopyLinkHandler}
      >
        <Text style={[s.copyText, styles?.header?.shareLink?.copyText]}>
          {isLinkCopied ? copiedText : copyText}
        </Text>
        <Image
          source={isLinkCopied ? R.icons.check : R.icons.copy}
          style={[
            s.copyIcon,
            styles?.header?.shareLink?.copyIcon,
            {
              tintColor: isLinkCopied ? copyIconTintActive : copyIconTint,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  )

  const renderHeader = () => (
    <View style={styles?.header?.container}>
      <Text style={styles?.header?.title}>{title}</Text>
      <Text style={styles?.header?.subTitle}>{subTitle}</Text>
      <Text style={styles?.header?.shareLink?.message}>{referralLink} </Text>
      {header?.shareLink && renderShareLink()}
      <Text style={styles?.header?.shareLink?.referrals}>
        {soFarText}{' '}
        <Text style={styles?.header?.shareLink?.referralValue}>
          {header.salesReferred}
        </Text>{' '}
        {ticketsText}
      </Text>
    </View>
  )

  const parsedItems: IOrderDetailsSectionData[] | undefined = items
    ? _map(items, (item) => {
        return {
          id: `${item.name}.${item.price}`,
          item: item,
        }
      })
    : undefined

  const parsedTickets = _map(tickets, (item) => {
    return {
      id: `${item.hash}`,
      item: item,
    }
  })

  const itemsData = [
    {
      title: items ? texts?.listItem?.title || 'Items' : '',
      data: parsedItems || [],
      renderItem: ({ item }: any) => renderItemComp(item),
      id: 0,
    },
    {
      title: ticketsTitle,
      data: parsedTickets,
      renderItem: ({ item }: any) => _renderTicket(item),
      id: 1,
    },
  ]

  const renderItemComp = ({ item }: { item: IMyOrderDetailsItem }) =>
    item ? (
      <View style={[s.listItemContainer, styles?.listItem?.container]}>
        <View style={styles?.listItem?.innerLeftContainer}>
          <Text style={styles?.listItem?.rowPlaceholder}>
            {itemsTicketType}{' '}
            <Text style={styles?.listItem?.rowValue}>{item.name}</Text>
          </Text>
          <View style={s.rowContainer}>
            <Text style={styles?.listItem?.rowPlaceholder}>{itemsPrice}</Text>
            <Text style={styles?.listItem?.rowValue}>
              {item.currency}
              {item.price}
            </Text>
          </View>
          <View style={s.rowContainer}>
            <Text style={styles?.listItem?.rowPlaceholder}>
              {itemsQuantity}
            </Text>
            <Text style={styles?.listItem?.rowValue}>{item.quantity}</Text>
          </View>
        </View>
        <View
          style={[
            s.listItemInnerRightContainer,
            styles?.listItem?.innerRightContainer,
          ]}
        >
          <Text style={styles?.listItem?.rowPlaceholder}>{itemsTotal}</Text>
          <Text style={styles?.listItem?.rowValue}>
            {item.currency}
            {item.total}
          </Text>
        </View>
      </View>
    ) : null

  const _renderTicket = ({ item }: { item: IMyOrderDetailsTicket }) => (
    <TicketListItem
      data={item}
      styles={styles?.ticketItem}
      texts={{
        ticketType: ticketsType,
        holderName: ticketsHolderName,
        ticketId: ticketsId,
        status: ticketsStatus,
        download: download,
        sellTicket: sellTicket,
        removeTicketFromResale: removeTicketFromResale,
      }}
      onPressActionsButton={handleOnTicketSelection}
      moreButtonIcon={moreButtonIcon || R.icons.more}
    />
  )

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SectionList
        ListHeaderComponent={renderHeader}
        //@ts-ignore
        sections={[...itemsData]}
        renderSectionHeader={({ section }) => {
          if (section.id === 0) {
            if (!items) {
              return null
            }
          }
          return <Text style={styles?.sectionHeader}>{section.title}</Text>
        }}
        renderSectionFooter={({ section }) => {
          if (section.id === 0 && parsedItems) {
            return (
              <View
                style={[
                  s.sectionFooterContainer,
                  styles?.section0Footer?.container,
                ]}
              >
                <Text style={styles?.section0Footer?.label}>{itemsTotal}</Text>
                <Text style={styles?.section0Footer?.value}>
                  {parsedItems ? parsedItems[0]!!.item.currency : ''}{' '}
                  {header.total}
                </Text>
              </View>
            )
          }
          return null
        }}
      />
      {config?.areAlertsEnabled &&
        (downloadStatus === 'downloaded' || downloadStatus === 'failed') && (
          <Notification
            isSuccess={downloadStatus === 'downloaded'}
            textSuccess={texts?.downloadNotification?.successMessage}
            textError={texts?.downloadNotification?.errorMessage}
          />
        )}
      {isLoading && <Loading />}

      {selectedTicket && (
        <BottomSheetModal
          onClose={handleHideActionsModal}
          styles={styles?.bottomSheetModal}
          texts={texts?.bottomSheetModal}
          ref={bottomSheetModalRef}
          content={
            <TicketActions
              onSelectAction={handleOnActionSelected}
              ticket={selectedTicket}
              styles={styles?.ticketActions}
              texts={texts?.ticketActions}
              icons={ticketActionsIcons}
            />
          }
        />
      )}
    </View>
  )
}

export default MyOrderDetailsView
