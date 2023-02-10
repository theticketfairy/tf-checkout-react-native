import _map from 'lodash/map'
import React, { FC, useEffect } from 'react'
import { Text, View } from 'react-native'

import AddOnListItem from './AddOnListItem'
import { getAddOnsData } from './AddOnsHelper'
import { IAddOnsTypes } from './IAddOnsTypes'

const AddOns: FC<IAddOnsTypes> = ({ styles, texts, addOnsResponseData }) => {
  useEffect(() => {
    console.log('Rendering Addons', addOnsResponseData)
    const pero = getAddOnsData(addOnsResponseData)

    console.log('Rendering Addons --- perop', pero)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <View style={styles?.rootContainer}>
      <View>
        <Text>Upgrades and Add-Ons</Text>
        <Text>Please select the optional add-ons you would like: </Text>
      </View>

      <View>
        {/* {_map(addOns, (addOn, index) => (
          <AddOnListItem addOn={addOn} />
        ))} */}
      </View>

      <View />
    </View>
  )
}

export default AddOns
