import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    marginVertical: 8,
  },
  rightContent: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  downloadButtonText: {
    fontSize: 12,
  },
  downloadButton: {
    height: 30,
    marginVertical: 8,
  },
  moreButton: {
    marginRight: 4,
    marginBottom: 4,
  },
  moreButtonIcon: {
    height: 25,
    width: 30,
    resizeMode: 'contain',
  },
})
