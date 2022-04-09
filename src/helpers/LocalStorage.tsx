import AsyncStorage from '@react-native-async-storage/async-storage'

export const LocalStorageKeys = {
  AUTH_GUEST_TOKEN: 'AUTH_GUEST_TOKEN',
  USER_DATA: 'USER_DATA',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHECKOUT_DATA: 'CHECKOUT_DATA',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
}

export interface IStoredUserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (ex) {
    return undefined
  }
}

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (ex) {
    return undefined
  }
}

export const deleteData = async (key: string) => {
  try {
    const value = await AsyncStorage.removeItem(key)
    if (value !== null) {
      return value
    }
  } catch (ex) {
    return undefined
  }
}

export const deleteAllData = async () => {
  try {
    const value = await AsyncStorage.multiRemove([
      LocalStorageKeys.ACCESS_TOKEN,
      LocalStorageKeys.AUTH_GUEST_TOKEN,
      LocalStorageKeys.USER_DATA,
      LocalStorageKeys.CHECKOUT_DATA,
      LocalStorageKeys.REFRESH_TOKEN,
    ])
    if (value !== null) {
      return value
    }
  } catch (ex) {
    return undefined
  }
}

export const checkStoredData = async () => {
  try {
    const values = await AsyncStorage.multiGet([
      LocalStorageKeys.ACCESS_TOKEN,
      LocalStorageKeys.AUTH_GUEST_TOKEN,
      LocalStorageKeys.USER_DATA,
      LocalStorageKeys.CHECKOUT_DATA,
      LocalStorageKeys.REFRESH_TOKEN,
    ])
    return values
  } catch (ex) {
    console.log('Local Storage GetData Error - checkStoredData', ex)
  }
}
