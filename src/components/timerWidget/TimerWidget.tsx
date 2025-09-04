import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { showZero } from '../../utils/normalizers'

interface TimerWidgetProps {
  expires_at: number // Unix timestamp
  buyLoading?: boolean
  onCountdownFinish?: () => void
  style?: any
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  expires_at,
  // buyLoading = false,
  onCountdownFinish,
  style,
}) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (!expires_at) return

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = expires_at - now

      if (remaining <= 0) {
        setIsExpired(true)
        setTimeLeft(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        onCountdownFinish?.()
        return 0
      }

      return remaining
    }

    // Initial calculation
    const initial = calculateTimeLeft()
    setTimeLeft(initial)

    if (initial > 0) {
      // Update every second
      intervalRef.current = setInterval(() => {
        const remaining = calculateTimeLeft()
        setTimeLeft(remaining)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [expires_at, onCountdownFinish])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${showZero(minutes)}:${showZero(remainingSeconds)}`
  }

  if (!expires_at || isExpired) {
    return null
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.timerContent}>
        <Text style={styles.label}>Time remaining:</Text>
        <Text
          style={[
            styles.timer,
            timeLeft <= 300 && styles.timerWarning, // Warning when 5 minutes or less
            timeLeft <= 60 && styles.timerDanger, // Danger when 1 minute or less
          ]}
        >
          {formatTime(timeLeft)}
        </Text>
      </View>
      {timeLeft <= 300 && (
        <Text style={styles.warningText}>
          Your cart will expire soon. Complete your purchase to secure your
          tickets.
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginRight: 8,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    fontFamily: 'monospace',
  },
  timerWarning: {
    color: '#fd7e14',
  },
  timerDanger: {
    color: '#dc3545',
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
})
