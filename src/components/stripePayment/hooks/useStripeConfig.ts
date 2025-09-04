import { initStripe, InitStripeParams } from '@stripe/stripe-react-native'
import { useEffect, useState } from 'react'

export interface UseStripeConfigProps {
  stripePublishableKey?: string
  stripeAccountId?: string
  elementsConfig?: any
}

export const useStripeConfig = ({
  stripePublishableKey,
  stripeAccountId,
  elementsConfig,
}: UseStripeConfigProps) => {
  const [isStripeInitialized, setIsStripeInitialized] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      if (!stripePublishableKey) {
        setStripeError('No Stripe publishable key provided')
        return
      }

      try {
        const initParams: InitStripeParams = {
          publishableKey: stripePublishableKey,
          merchantIdentifier: 'merchant.com.theticketfairy',
        }

        if (stripeAccountId) {
          initParams.stripeAccountId = stripeAccountId
        }

        await initStripe(initParams)
        setIsStripeInitialized(true)
        setStripeError(null)
      } catch (error) {
        console.error('Failed to initialize Stripe:', error)
        setStripeError(
          error instanceof Error ? error.message : 'Failed to initialize Stripe'
        )
      }
    }

    initializeStripe()
  }, [stripePublishableKey, stripeAccountId])

  return {
    isStripeInitialized,
    stripeError,
    elementsConfig,
  }
}
