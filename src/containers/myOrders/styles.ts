import { StyleSheet } from 'react-native'

import R from '../../res'

export const MyOrdersViewStyles = StyleSheet.create({
  eventsContainer: {
    marginVertical: 16,
  },
  eventsTitle: {
    marginBottom: 8,
  },
  eventsDropdownContainer: {
    flex: 1,
    marginRight: 16,
  },
  eventsDropdownButton: {
    marginBottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  listContainer: {
    //flex: 1,
  },
  backButtonContainer: {
    marginBottom: 24,
  },
  rootContainer: {
    flex: 1,
  },
  eventsSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  clearEventSelectionIcon: {
    tintColor: R.colors.white,
    width: 20,
    height: 20,
  },
})
