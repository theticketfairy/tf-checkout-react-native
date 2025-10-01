import InputPhone from '@sesamsolutions/phone-input';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import Input from '../input/Input';
import s from './/styles';
import { IOnChangePhoneNumberPayload, IPhoneInputProps } from './types';

const PhoneInput: FC<IPhoneInputProps> = ({
  phoneNumber,
  onChangePhoneNumber,
  onBlur,
  styles,
  error,
  texts,
  country = 'US',
}) => {
  const [localValue, setLocalValue] = useState('');
  const setLocalValueCallback = useCallback(() => {
    setLocalValue(phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    setLocalValueCallback();
  }, [phoneNumber, setLocalValueCallback]);

  const handleOnChangeInputPhone = (payload: IOnChangePhoneNumberPayload) => {
    setLocalValue(payload.input);
    onChangePhoneNumber(payload);
  };

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <Input
        onChangeText={setLocalValue}
        onBlur={onBlur}
        label={texts?.label || 'Phone number'}
        keyboardType="phone-pad"
        value={localValue}
        styles={{
          container: s.phoneInputContainer,
          ...styles?.input,
          color: error ? styles?.input?.errorColor : styles?.input?.baseColor,
        }}
        labelOffset={{ x1: -32 }}
        renderLeftAccessory={() => (
          <View style={(s.countryContainer, styles?.country?.container)}>
            <InputPhone
              initialCountry={country}
              onChange={handleOnChangeInputPhone}
              style={s.countryButton}
              textStyle={s.textInput}
              value={localValue}
              dismissKeyboard={false}
            />
          </View>
        )}
        error={error}
      />
    </View>
  );
};

export default PhoneInput;
