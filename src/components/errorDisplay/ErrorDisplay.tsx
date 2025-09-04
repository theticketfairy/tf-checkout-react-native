import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ErrorDisplayProps {
  error: string | null
  onClose?: () => void
  severity?: 'error' | 'warning' | 'info'
  style?: any
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClose,
  severity = 'error',
  style,
}) => {
  if (!error) return null

  const getBackgroundColor = () => {
    switch (severity) {
      case 'warning':
        return '#fff3cd'
      case 'info':
        return '#d1ecf1'
      default:
        return '#f8d7da'
    }
  }

  const getBorderColor = () => {
    switch (severity) {
      case 'warning':
        return '#ffeaa7'
      case 'info':
        return '#bee5eb'
      default:
        return '#f5c6cb'
    }
  }

  const getTextColor = () => {
    switch (severity) {
      case 'warning':
        return '#856404'
      case 'info':
        return '#0c5460'
      default:
        return '#721c24'
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style,
      ]}
    >
      <Text style={[styles.errorText, { color: getTextColor() }]}>{error}</Text>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeButtonText, { color: getTextColor() }]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
