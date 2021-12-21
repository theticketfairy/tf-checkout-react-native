import _map from 'lodash/map'
import React from 'react'
import { View } from 'react-native'

import { Checkbox } from '../../../components'
import { IFormFieldProps } from '../../../components/formField/types'
import { ConditionsStyles as s } from './styles'

const ConditionItem = ({ id, checkboxProps }: IFormFieldProps) => (
  <Checkbox
    key={id}
    text={checkboxProps!.text}
    isActive={checkboxProps!.isActive}
    onPress={() => checkboxProps!.onPress(id!)}
  />
)

const Conditions = (props: IFormFieldProps[]) => {
  return <View style={s.rootContainer}>{_map(props, ConditionItem)}</View>
}

export default Conditions
