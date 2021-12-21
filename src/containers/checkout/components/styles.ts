import { StyleSheet } from 'react-native'

export const OrderReviewStyles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: 0,
    marginVertical: 24,
    paddingVertical: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  orderItemContainer: {
    paddingVertical: 4,
    width: '50%',
  },
  orderItemTitle: {
    fontWeight: '800',
    fontSize: 16,
  },
  orderItemValue: {
    lineHeight: 20,
  },
})

export const ConditionsStyles = StyleSheet.create({
  rootContainer: {
    marginVertical: 16,
  },
})
