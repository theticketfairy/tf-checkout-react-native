import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IRadioGroupProps } from './types';

const RadioGroup = ({
  options,
  selectedValue,
  onValueChange,
  label,
  error,
  styles,
}: IRadioGroupProps) => {
  return (
    <View style={[{ marginBottom: 16 }, styles?.container]}>
      {label && (
        <Text
          style={[
            { fontSize: 16, fontWeight: '500', marginBottom: 8 },
            styles?.labelText,
          ]}
        >
          {label}
        </Text>
      )}
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              },
              styles?.optionContainer,
            ]}
            onPress={() => {
              onValueChange(option.value);
            }}
          >
            <View
              style={[
                {
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected ? '#007BFF' : '#C4C4C4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                },
                styles?.radioOuter,
                isSelected && styles?.radioOuterSelected,
              ]}
            >
              {isSelected && (
                <View
                  style={[
                    {
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: '#007BFF',
                    },
                    styles?.radioInner,
                  ]}
                />
              )}
            </View>
            <Text style={[{}, styles?.optionText]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
      {error && (
        <Text
          style={[
            { color: 'red', fontSize: 12, marginTop: 5 },
            styles?.errorText,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default RadioGroup;
