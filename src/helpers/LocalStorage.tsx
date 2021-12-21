import AsyncStorage from '@react-native-async-storage/async-storage'

export const LocalStorageKeys = {
  AUTH_GUEST_TOKEN: 'AUTH_GUEST_TOKEN',
  USER_DATA: 'USER_DATA',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHECKOUT_DATA: 'CHECKOUT_DATA',
}

export interface IStoredUserData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const storeData = async (key: string, value: string) => {
  console.log(`StoreData with key ${key} and value ${value}`)

  try {
    await AsyncStorage.setItem(key, value)
  } catch (ex) {
    console.log('Local Storage StoreData Error', ex)
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
    console.log('Local Storage GetData Error', ex)
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
    console.log('Local Storage GetData Error', ex)
    return undefined
  }
}

export const deleteAllData = async () => {
  try {
    const value = await AsyncStorage.multiRemove([
      LocalStorageKeys.ACCESS_TOKEN,
      LocalStorageKeys.AUTH_GUEST_TOKEN,
      LocalStorageKeys.USER_DATA,
    ])
    if (value !== null) {
      return value
    }
  } catch (ex) {
    console.log('Local Storage GetData Error', ex)
    return undefined
  }
}
