//@ts-nocheck
import Clipboard from '@react-native-clipboard/clipboard'
import _map from 'lodash/map'
import React, { FC } from 'react'
import {
  Image,
  SectionList,
  SectionListProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { IMyOrderDetailsTicket } from '../../api/types'
import { Button } from '../../components'
import R from '../../res'
import Notification from './components/Notification'
import s from './styles'
import { IMyOrderDetailsView } from './types'

const MyOrderDetailsView: FC<IMyOrderDetailsView> = ({
  data: { header, items, tickets },
  styles,
  texts,
  isLinkCopied,
  onPressCopyLink,
  onPressTicketDownload,
  downloadStatus,
}) => {
  //#region Handlers
  const onCopyLinkHandler = () => {
    if (isLinkCopied) {
      return
    }
    Clipboard.setString(header.shareLink)
    onPressCopyLink()
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

  const ticketsTitle = texts?.ticketItem?.title || 'Your Tickets: '
  const ticketsId = texts?.ticketItem?.ticketId || 'Ticket ID: '
  const ticketsType = texts?.ticketItem?.ticketType || 'Ticket Type: '
  const ticketsHolderName =
    texts?.ticketItem?.ticketHolder || 'Ticket Holder Name: '
  const ticketsStatus = texts?.ticketItem?.status || 'Status: '
  const ticketsDownload = texts?.ticketItem?.download || 'Download'

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
          {isLinkCopied ? 'Copied' : 'Copy'}
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
        So far, you've referred{' '}
        <Text style={styles?.header?.shareLink?.referralValue}>
          {header.salesReferred}
        </Text>{' '}
        tickets.
      </Text>
    </View>
  )

  const parsedItems = _map(items, (item) => {
    return {
      id: `${item.name}.${item.price}`,
      item: item,
    }
  })

  const parsedTickets = _map(tickets, (item) => {
    return {
      id: `${item.hash}`,
      item: item,
    }
  })

  const itemsData: SectionListProps = [
    {
      title: texts?.listItem?.title || 'Items',
      data: parsedItems,
      renderItem: ({ item }) => renderItemComp(item),
      id: 0,
    },
    {
      title: ticketsTitle,
      data: parsedTickets,
      renderItem: ({ item }) => renderTicketComp(item),
      id: 1,
    },
  ]

  const renderItemComp = ({ item }) => (
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
          <Text style={styles?.listItem?.rowPlaceholder}>{itemsQuantity}</Text>
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
  )

  const renderTicketComp = ({ item }: { item: IMyOrderDetailsTicket }) => (
    <View style={[s.ticketItemContainer, styles?.ticketItem?.container]}>
      <View style={styles?.ticketItem?.innerLeftContainer}>
        <View style={s.rowContainer}>
          <Text style={styles?.ticketItem?.rowPlaceholder}>{ticketsId}</Text>
          <Text style={styles?.ticketItem?.rowValue}>{item.hash}</Text>
        </View>
        <View style={s.rowContainer}>
          <Text style={styles?.ticketItem?.rowPlaceholder}>{ticketsType}</Text>
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
          onPress={() => onPressTicketDownload(item.pdfLink, item.hash)}
        />
      </View>
    </View>
  )

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <SectionList
        ListHeaderComponent={renderHeader}
        sections={[...itemsData]}
        renderSectionHeader={({ section }) => (
          <Text style={styles?.sectionHeader}>{section.title}</Text>
        )}
        renderSectionFooter={({ section }) => {
          if (section.id === 0) {
            return (
              <View
                style={[
                  s.sectionFooterContainer,
                  styles?.section0Footer?.container,
                ]}
              >
                <Text style={styles?.section0Footer?.label}>{itemsTotal}</Text>
                <Text style={styles?.section0Footer?.value}>
                  {header.total}
                </Text>
              </View>
            )
          }
          return null
        }}
      />
      {(downloadStatus === 'downloaded' || downloadStatus === 'failed') && (
        <Notification isSuccess={downloadStatus === 'downloaded'} />
      )}
    </View>
  )
}

export default MyOrderDetailsView
