import React, { useEffect } from 'react'
import TFCheckoutRNModule, { Counter } from 'tf-checkout-react-native'

const App = () => {
  useEffect(() => {
    console.log(TFCheckoutRNModule)
  })

  return <Counter />
}

export default App
