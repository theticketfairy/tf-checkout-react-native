import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  shareLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyContainer: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  copyText: {
    fontSize: 11,
  },
  copyIcon: {
    height: 16,
    width: 16,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  sectionFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    marginVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  listItemInnerRightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  ticketItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    marginVertical: 8,
  },
  ticketItemInnerRightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})
