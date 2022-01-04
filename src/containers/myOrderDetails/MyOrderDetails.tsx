import React, { FC } from 'react'
import { SectionListData } from 'react-native'

import MyOrderDetailsView from './MyOrderDetailsView'
import { IMyOrderDetailsProps } from './types'
const MyOrderDetails: FC<IMyOrderDetailsProps> = ({ data, styles, texts }) => {
  const { header, items, tickets } = data
  console.log('header', header)
  console.log('tickets', tickets)
  console.log('items', items)

  return <MyOrderDetailsView data={data} styles={styles} texts={texts} />
}

export default MyOrderDetails
