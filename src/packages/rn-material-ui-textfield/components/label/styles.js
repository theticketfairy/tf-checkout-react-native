import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    transformOrigin: 'left',
    transform: [{ translateX: '-50%' }],
  },

  text: {
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
});
