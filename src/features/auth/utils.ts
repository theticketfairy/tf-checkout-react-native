import { setAccessTokenHandler } from '../../api/ApiClient';
import { LocalStorageKeys, storeData } from '../../helpers/LocalStorage';
import { IAuthAttributes } from './types';

// Helper to store authentication tokens
export const storeAuthTokens = async (
  attributes: IAuthAttributes
): Promise<void> => {
  const accessToken = attributes.access_token;
  const refreshToken = attributes.refresh_token;
  const tokenType = attributes.token_type;
  const scope = attributes.scope;

  if (!accessToken) return;

  await setAccessTokenHandler(accessToken);

  if (refreshToken) {
    await storeData(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
  }

  if (tokenType) {
    await storeData(LocalStorageKeys.TOKEN_TYPE, tokenType);
  }

  if (scope) {
    await storeData(LocalStorageKeys.AUTH_SCOPE, scope);
  }
};
