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
import { IMyOrderDetailsView } from './types'

const MyOrderDetailsView: FC<IMyOrderDetailsView> = ({
  data: { header, items, tickets },
  styles,
  texts,
  onGoBack,
  isLinkCopied,
  onPressCopyLink,
  onPressTicketDownload,
  isDownloadingTicket,
}) => {
  //#region Handlers
  const onGoBackHandler = () => {
    if (onGoBack) {
      onGoBack()
    }
  }

  const onCopyLinkHandler = () => {
    Clipboard.setString(header.shareLink)
    onPressCopyLink()
  }
  //#endregion

  const renderShareLink = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text numberOfLines={1} ellipsizeMode='head'>
        {header.shareLink}
      </Text>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          borderWidth: 1,
          padding: 4,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
        onPress={onCopyLinkHandler}
      >
        <Text style={{ fontSize: 11 }}>{isLinkCopied ? 'Copied' : 'Copy'}</Text>
        <Image
          source={isLinkCopied ? R.icons.check : R.icons.copy}
          style={{
            height: 16,
            width: 16,
            marginLeft: 4,
            resizeMode: 'contain',
            tintColor: isLinkCopied ? R.colors.validGreen : R.colors.black,
          }}
        />
      </TouchableOpacity>
    </View>
  )

  const renderHeader = () => (
    <View>
      <Text>ORDER DETAILS</Text>
      <Text>ORDER SUMMARY</Text>
      <Text>Your personal share link for this event is: </Text>
      {renderShareLink()}
      <Text>So far, you've referred {header.salesReferred} tickets.</Text>
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
      title: 'Items',
      data: parsedItems,
      renderItem: ({ item }) => renderItemComp(item),
    },
    {
      title: 'Your Tickets',
      data: parsedTickets,
      renderItem: ({ item }) => renderTicketComp(item),
    },
  ]

  const renderItemComp = ({ item }) => {
    console.log('Item', item)

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 2,
          marginVertical: 8,
        }}
      >
        <View>
          <Text>Ticket Type: {item.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>Price: </Text>
            <Text>
              {item.currency}
              {item.price}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Quantity: </Text>
            <Text>{item.quantity}</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Text>Total</Text>
          <Text>
            {item.currency}
            {item.total}
          </Text>
        </View>
      </View>
    )
  }

  const renderTicketComp = ({ item }: { item: IMyOrderDetailsTicket }) => {
    console.log('TICKET Item', item)

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 2,
          marginVertical: 8,
        }}
      >
        <View>
          <Text>Ticket ID: {item.hash}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>Ticket Type: </Text>
            <Text>{item.ticketType}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Ticket Holder Name: </Text>
            <Text>{item.holderName}</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Text>
            Status: <Text>{item.status}</Text>
          </Text>

          <Button
            isLoading={isDownloadingTicket}
            text='Download'
            styles={{
              text: {
                fontSize: 12,
              },
              button: {
                height: 30,
                marginVertical: 8,
              },
            }}
            onPress={() => onPressTicketDownload(item.pdfLink, item.hash)}
          />
        </View>
      </View>
    )
  }

  console.log('Parsed Items', parsedItems)

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        ListHeaderComponent={renderHeader}
        sections={[...itemsData]}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderSectionFooter={({ section }) => {
          if (section === 0) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>Total</Text>
                <Text>{header.total}</Text>
              </View>
            )
          }
        }}
      />
      <View>
        <Button text='Go Back' onPress={onGoBackHandler} />
      </View>
    </View>
  )
}

export default MyOrderDetailsView
