import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, NativeModules } from 'react-native'
import Color from './Colors'

interface DebugMenuProps {
  onClose: () => void
}

const DebugMenu: React.FC<DebugMenuProps> = ({ onClose }) => {
  const enableRemoteDebugging = () => {
    if (__DEV__) {
      // Enable remote debugging by opening debugger URL
      Linking.openURL('http://localhost:8081/debugger-ui/')
      Alert.alert(
        'Remote Debugging Enabled',
        'React Native Debugger should now connect. Open the Network tab to monitor requests.',
        [{ text: 'OK', onPress: onClose }]
      )
    }
  }

  const openDevMenu = () => {
    if (__DEV__) {
      try {
        // Try to access DevMenu through NativeModules
        if (NativeModules.DevMenu) {
          NativeModules.DevMenu.show()
        } else {
          Alert.alert('Dev Menu', 'Shake device or press Cmd+D to open dev menu')
        }
      } catch (error) {
        Alert.alert('Dev Menu', 'Shake device or press Cmd+D to open dev menu')
      }
    }
  }

  const reloadApp = () => {
    if (__DEV__) {
      try {
        if (NativeModules.DevSettings) {
          NativeModules.DevSettings.reload()
        } else {
          Alert.alert('Reload', 'Press Cmd+R to reload the app')
        }
      } catch (error) {
        Alert.alert('Reload', 'Press Cmd+R to reload the app')
      }
    }
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        <Text style={styles.title}>Debug Menu</Text>
        
        <TouchableOpacity style={styles.button} onPress={enableRemoteDebugging}>
          <Text style={styles.buttonText}>Enable Remote Debugging</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openDevMenu}>
          <Text style={styles.buttonText}>Open Dev Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={reloadApp}>
          <Text style={styles.buttonText}>Reload App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  menu: {
    backgroundColor: Color.backgroundMain,
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Color.primary,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: Color.gray80,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
})

export default DebugMenu
