import {
  getDeviceType as getDeviceTypeInfo,
  getSystemName as getSystemNameInfo,
} from 'react-native-device-info'

export const getDeviceType = () => {
  const deviceType = getDeviceTypeInfo()
  switch (deviceType) {
    case 'Tablet':
      return 'Tablet'
    case 'Handset':
      return 'Mobile Device'
    case 'Desktop':
      return 'Desktop'
    default:
      return 'unknown'
  }
}

export const getSystemName = () => {
  const deviceType = getSystemNameInfo()
  switch (deviceType) {
    case 'Android':
      return 'Android OS'
    default:
      return 'iPod, iPhone & iPad'
  }
}