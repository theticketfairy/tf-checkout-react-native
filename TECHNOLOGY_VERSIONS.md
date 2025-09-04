# Technology Versions & Setup Guide

## tf-checkout-react-native Library

### Core Technologies

- **React Native**: `0.72.9`
- **React**: `18.1.0`
- **TypeScript**: `4.5.2`
- **Node.js**: Compatible with React Native 0.72.9 requirements
- **iOS Deployment Target**: `12.0` (from podspec)

### Build Tools & Bundlers

- **Metro**: `0.70.3` (metro-react-native-babel-preset)
- **Babel Core**: `7.16.0`
- **Babel Runtime**: `7.16.3`
- **ESLint**: `7.14.0`
- **Jest**: `27.3.1`

### Key Dependencies

- **Stripe React Native**: `^0.39.0`
- **Axios**: `0.24.0`
- **Axios Retry**: `3.2.4`
- **Formik**: `^2.4.5`
- **Yup**: `^1.4.0`
- **Lodash**: `4.17.21`
- **JWT Decode**: `3.1.2`

### React Native Specific Libraries

- **AsyncStorage**: `^2.0.0`
- **Clipboard**: `^1.14.0`
- **DateTimePicker**: `^8.0.0`
- **Phone Input**: `jorgtz/react-native-phone-input` (custom fork)
- **Background Timer**: `2.4.1`
- **Device Country**: `1.0.2`
- **File System**: `2.18.0`
- **Keyboard Aware ScrollView**: `0.9.5`
- **Modal DateTime Picker**: `13.0.0`
- **Material UI TextField**: `https://github.com/jorgtz/rn-material-ui-textfield` (custom fork)

## Example App Configuration

### Core Technologies

- **React Native**: `0.72.9`
- **React**: `18.1.0`
- **TypeScript**: `4.5.2`

### Build Tools

- **Metro**: `0.70.3`
- **Babel Core**: `7.16.0`
- **ESLint**: `7.32.0`
- **Jest**: `27.3.1`

### Additional Dependencies

- **React Native Config**: `1.5.0` (for environment variables)
- **Stripe React Native**: `0.26.0` (older version for compatibility)

## Scripts & Commands

### Main Library Scripts

```bash
# Compile TypeScript to JavaScript
npm run compile
# or
yarn compile

# Prepare for publishing (runs compile)
npm run prepare
# or
yarn prepare
```

### Example App Scripts

```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on iOS simulator
npm run ios
# or
yarn ios

# Run on Android emulator/device
npm run android
# or
yarn android

# Compile TypeScript
npm run compile
# or
yarn compile

# Build Android release APK
npm run androidBuild
# or
yarn androidBuild

# Bundle Android assets
npm run androidClear
# or
yarn androidClear
```

## Installation & Setup

### Prerequisites

- **Node.js**: v20.19.4
- **npm**: 10.8.2
- **React Native CLI**: `npm install -g react-native-cli`
- **CocoaPods**: 1.11.x or higher (for iOS) (1.16.2)
- **Android Studio**: Latest stable version (for Android)
- **Xcode**: 13.x or higher (for iOS development on macOS) (16.4)

### Example App Setup

```bash
# Navigate to example directory
cd example/

# Install dependencies
yarn install

# For iOS - install CocoaPods dependencies
cd ios/
pod install
cd ..

# Start Metro bundler
npm start
# or
yarn start

# In a new terminal, run the app
npm run ios    # for iOS
# or
npx react-native run-ios --simulator="iPhone 16 Pro"
npm run android # for Android
```

## Compatibility Notes

### React Native Version Compatibility

- **Current**: React Native `0.72.9` with React `18.1.0`
- **Previous Issues**: Originally used React Native `0.79.0` but downgraded due to peer dependency conflicts
- **Recommendation**: Use `--legacy-peer-deps` flag when installing to bypass strict peer dependency resolution

### Platform Support

- **iOS**: Minimum deployment target iOS 12.0
- **Android**: Compatible with Android API level as supported by React Native 0.72.9

### Known Issues & Solutions

1. **Peer Dependency Conflicts**: Use `npm install --legacy-peer-deps` or `yarn install`
2. **CocoaPods Issues**: Clean Pods directory and run `pod install` if encountering iOS build issues
3. **Metro Bundler Port Conflicts**: Kill existing processes on port 8081 if needed
4. **TypeScript Compilation**: Some components may have TypeScript errors but don't block functionality

### Development Environment

- **Recommended Node Version**: 16.x or 18.x
- **Package Manager**: npm with `--legacy-peer-deps` or Yarn 1.x
- **IDE**: VS Code with React Native and TypeScript extensions
- **Debugging**: React Native Debugger or Flipper

---

*Last Updated: September 2025*
*Compatible with React Native 0.72.9 and React 18.1.0*
