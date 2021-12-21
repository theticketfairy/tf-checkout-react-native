import { StyleSheet } from 'react-native'

import R from '../../res'

export default StyleSheet.create({
  rootContainer: {
    backgroundColor: R.colors.white,
    padding: 24,
    flex: 1,
  },
  messagesContainer: {
    marginVertical: 24,
    padding: 12,
    backgroundColor: 'gainsboro',
  },
  title: {
    fontWeight: '700',
    color: R.colors.black,
    fontSize: 22,
  },

  promoContainer: {
    marginVertical: 24,
  },
  promoTitleKeyword: {
    fontWeight: '800',
    color: R.colors.danger,
  },
  promoTitle: {
    fontSize: 25,
  },
  promoMessage: {
    fontSize: 18,
    marginTop: 8,
  },
  promoMessageKeyword: {
    fontWeight: '600',
  },
  promoDiscount: {
    fontWeight: '700',
    color: R.colors.danger,
  },

  inviteContainer: {
    marginVertical: 24,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  inviteMessage: {
    fontSize: 18,
  },

  inviteLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  inviteLink: {
    padding: 8,
    backgroundColor: R.colors.black,
    color: R.colors.white,
  },
  copyButton: {
    backgroundColor: R.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    padding: 4,
  },
  copyIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: R.colors.white,
  },
})
