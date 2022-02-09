import React, { ReactNode, useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { IConfig, setConfig } from '../../helpers/Config'

export interface IWrapperProps {
  children: ReactNode
  config: IConfig
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const Wrapper = ({ config, children }: IWrapperProps) => {
  const [isConfigFinished, setIsConfigFinished] = useState(false)
  const { container } = styles
  const handleConfig = () => {
    const configResult = setConfig(config)

    if (configResult) {
      Alert.alert(
        'Missing configuration',
        `${configResult}\nPlease check your config object`
      )
      return setIsConfigFinished(false)
    } else {
      setIsConfigFinished(true)
    }
  }

  useEffect(() => {
    handleConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <View style={container}>{isConfigFinished && children}</View>
}

export default Wrapper
