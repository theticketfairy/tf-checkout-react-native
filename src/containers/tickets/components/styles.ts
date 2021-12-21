import { StyleSheet } from 'react-native'

import R from '../../../res'

export const CartListItemStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  ticketNumber: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: R.colors.primary,
  },
  price: {
    fontWeight: '800',
    fontSize: 18,
    color: R.colors.primary,
  },
  soldOut: {
    fontWeight: '800',
    fontSize: 20,
    color: R.colors.primary,
  },
  leftContainer: {
    flex: 7,
  },
  rightContainer: {
    flex: 3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tax: {
    marginTop: 4,
    fontWeight: '600',
    color: R.colors.primary,
  },
  soldOutContainer: {
    borderRadius: 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderColor: R.colors.primary,
  },
  oldPrice: {
    fontSize: 16,
    color: R.colors.danger,
    textDecorationLine: 'line-through',
  },
})
