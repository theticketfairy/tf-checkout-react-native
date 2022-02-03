import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'

import { IConfig, setConfig } from '../../helpers/Config'

export interface IWrapperProps {
  children: React.ReactNode
  config: IConfig
}

const Wrapper = ({ config, children }: IWrapperProps) => {
  const [isConfigFinished, setIsConfigFinished] = useState(false)
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
    console.log('Use Callback', config)
    handleConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <View style={{ flex: 1 }}>{isConfigFinished && children}</View>
}

export default Wrapper
