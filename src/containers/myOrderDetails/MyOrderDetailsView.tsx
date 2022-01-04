import _map from 'lodash/map'
import React, { FC } from 'react'
import { SectionList, SectionListProps, Text, View } from 'react-native'

import { IMyOrderDetailsView } from './types'

const MyOrderDetailsView: FC<IMyOrderDetailsView> = ({
  data: { header, items, tickets },
  styles,
  texts,
}) => {
  const renderHeader = () => (
    <View>
      <Text>ORDER DETAILS</Text>
      <Text>ORDER SUMMARY</Text>
      <Text>Your personal share link for this event is: </Text>
      <Text>{header.shareLink}</Text>
    </View>
  )

  const parsedItems = _map(items, (item) => {
    return {
      id: `${item.name}.${item.price}`,
      item: item,
    }
  })

  const itemsData: SectionListProps = [
    {
      title: 'Items',
      data: parsedItems,
      renderItem: ({ item }) => renderItemComp(item),
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

  console.log('Parsed Items', parsedItems)

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        ListHeaderComponent={renderHeader}
        sections={[...itemsData]}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderSectionFooter={({ section }) => (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Total</Text>
            <Text>{header.total}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default MyOrderDetailsView
