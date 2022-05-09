import Clipboard from '@react-native-clipboard/clipboard'
import _map from 'lodash/map'
import React, { FC } from 'react'
import { Image, SectionList, Text, TouchableOpacity, View } from 'react-native'

import { IMyOrderDetailsItem, IMyOrderDetailsTicket } from '../../api/types'
import { Button, Loading } from '../../components'
import R from '../../res'
import Notification from './components/Notification'
import TicketListItem from './components/TicketListItem/TicketListItem'
import s from './styles'
import { IMyOrderDetailsViewProps, IOrderDetailsSectionData } from './types'

const MyOrderDetailsView: FC<IMyOrderDetailsViewProps> = ({
  data: { header, items, tickets },
  styles,
  texts,
  isLinkCopied,
  onPressCopyLink,
  onPressTicketDownload,
  downloadStatus,
  onPressResaleTicket,
  onPressRemoveTicketFromResale,
  config,
  isLoading,
}) => {
  //#region Handlers
  const onCopyLinkHandler = () => {
    if (isLinkCopied) {
      return
    }
    Clipboard.setString(header.shareLink)
    onPressCopyLink()
  }

  const handleOnPressSellTicket = (ticket: IMyOrderDetailsTicket) => {
    onPressResaleTicket(ticket)
  }

  const handleOnPressRemoveFromResale = async (
    ticket: IMyOrderDetailsTicket
  ) => {
    onPressRemoveTicketFromResale(ticket)
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
  const ticketsDownload = texts?.ticketItem?.download || 'Download'
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
      {renderShareLink()}
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
      isLoading={downloadStatus === 'downloading'}
      onPressSellTicket={handleOnPressSellTicket}
      onPressRemoveTicketFromResale={onPressRemoveTicketFromResale}
      onPressTicketDownload={onPressTicketDownload}
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
    />
  )

  const renderTicketComp = ({ item }: { item: IMyOrderDetailsTicket }) => (
    <View>
      <View style={[s.ticketItemContainer, styles?.ticketItem?.container]}>
        <View style={styles?.ticketItem?.innerLeftContainer}>
          <View style={s.rowContainer}>
            <Text style={styles?.ticketItem?.rowPlaceholder}>{ticketsId}</Text>
            <Text style={styles?.ticketItem?.rowValue}>{item.hash}</Text>
          </View>
          <View style={s.rowContainer}>
            <Text style={styles?.ticketItem?.rowPlaceholder}>
              {ticketsType}
            </Text>
            <Text style={styles?.ticketItem?.rowValue}>{item.ticketType}</Text>
          </View>
          <View style={s.rowContainer}>
            <Text style={styles?.ticketItem?.rowPlaceholder}>
              {ticketsHolderName}
            </Text>
            <Text style={styles?.ticketItem?.rowValue}>{item.holderName}</Text>
          </View>
        </View>

        <View
          style={[
            s.ticketItemInnerRightContainer,
            styles?.ticketItem?.innerRightContainer,
          ]}
        >
          <Text style={styles?.ticketItem?.rowPlaceholder}>
            {ticketsStatus}
            <Text style={styles?.ticketItem?.rowValue}>{item.status}</Text>
          </Text>

          {item.pdfLink && (
            <Button
              isLoading={downloadStatus === 'downloading'}
              text={ticketsDownload}
              styles={{
                text: {
                  fontSize: 12,
                },
                button: {
                  height: 30,
                  marginVertical: 8,
                },
                ...styles?.downloadButton,
              }}
              onPress={() => onPressTicketDownload(item.pdfLink!, item.hash)}
            />
          )}
        </View>
      </View>
      {item.isSellable && !item.isOnSale && (
        <Button
          onPress={() => handleOnPressSellTicket(item)}
          text={sellTicket}
          // styles={{
          //   container: s.resaleButtonContainer,
          //   button: s.resaleButton,
          //   text: s.resaleButtonText,
          //   ...styles?.resaleButton,
          // }}
        />
      )}
      {!item.isSellable && item.isOnSale && (
        <Button
          onPress={() => handleOnPressRemoveFromResale(item)}
          text={removeTicketFromResale}
          // styles={{
          //   container: s.resaleButtonContainer,
          //   button: s.resaleButton,
          //   text: s.resaleButtonText,
          //   ...styles?.resaleButton,
          // }}
        />
      )}
    </View>
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
                  {parsedItems ? parsedItems[0].item.currency : ''}{' '}
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
    </View>
  )
}

export default MyOrderDetailsView
