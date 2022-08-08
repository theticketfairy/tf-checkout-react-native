import { getDeviceType, getSystemName } from 'react-native-device-info'

export const switchGetDeviceType = () => {
  const deviceType = getDeviceType()
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

export const switchGetSystemName = () => {
  const deviceType = getSystemName()
  switch (deviceType) {
    case 'Android':
      return 'Android OS'
    default:
      return 'iPod, iPhone & iPad'
  }
}