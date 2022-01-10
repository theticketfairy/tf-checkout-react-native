import { Appearance } from 'react-native'

const isDark = Appearance.getColorScheme() === 'dark'

const lightTheme = {
  primary: 'black',
  disabled: 'gray',
  white: 'white',
  black: 'black',
  tint: 'rgba(0,0,0,0.1)',
  transparentBlack: 'rgba(0,0,0,0.5)',
  transparent: 'rgba(0,0,0,0)',
  danger: '#D9534F',
  listBackground: 'rgba(0,0,0,0.1)',
  validGreen: '#139679',
}

const darkTheme = {
  primary: 'white',
  disabled: 'gray',
  white: 'black',
  black: 'white',
  tint: 'rgba(100,100,100,0.7)',
  transparentBlack: 'rgba(0,0,0,0.5)',
  transparent: 'rgba(0,0,0,0)',
  danger: '#D9534F',
  listBackground: 'rgba(0,0,0,0.1)',
  validGreen: '#139679',
}

const currentTheme = isDark ? darkTheme : lightTheme

export default currentTheme
