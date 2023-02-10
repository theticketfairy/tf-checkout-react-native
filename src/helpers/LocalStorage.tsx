import AsyncStorage from '@react-native-async-storage/async-storage'

export const LocalStorageKeys = {
  AUTH_GUEST_TOKEN: 'AUTH_GUEST_TOKEN',
  USER_DATA: 'USER_DATA',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHECKOUT_DATA: 'CHECKOUT_DATA',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  RESET_PASS_TOKEN: 'RESET_PASS_TOKEN',
  AUTH_SCOPE: 'AUTH_SCOPE',
  AUTH_TOKEN_TYPE: 'AUTH_TOKEN_TYPE',
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
  console.log('DEleting all data')
  try {
    const value = await AsyncStorage.multiRemove([
      LocalStorageKeys.ACCESS_TOKEN,
      LocalStorageKeys.AUTH_GUEST_TOKEN,
      LocalStorageKeys.USER_DATA,
      LocalStorageKeys.CHECKOUT_DATA,
      LocalStorageKeys.REFRESH_TOKEN,
      LocalStorageKeys.RESET_PASS_TOKEN,
      LocalStorageKeys.AUTH_TOKEN_TYPE,
      LocalStorageKeys.AUTH_SCOPE,
    ])
    if (value !== null) {
      console.log('VALUE', value)

      return value
    }
  } catch (ex) {
    console.log('Can not delete all data', ex)
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
      LocalStorageKeys.RESET_PASS_TOKEN,
      LocalStorageKeys.AUTH_TOKEN_TYPE,
      LocalStorageKeys.AUTH_SCOPE,
    ])
    return values
  } catch (ex) {
    console.log('Local Storage GetData Error - checkStoredData')
  }
}
