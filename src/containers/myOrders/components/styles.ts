import { StyleSheet } from 'react-native'

import R from '../../../res'

export const OrderListItemStyles = StyleSheet.create({
  rootContainer: {
    backgroundColor: R.colors.listBackground,
    marginVertical: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: { height: 60, width: 60, resizeMode: 'contain' },
  infoRootContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  infoTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  infoBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  iconNext: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  iconNextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingRight: 0,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  eventName: {
    width: '65%',
  },
})
