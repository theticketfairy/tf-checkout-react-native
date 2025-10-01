// const env = process.env.SDK_MODE || 'dev';

// if (env === 'release') {
//   console.log('[Expo Metro] Using RELEASE config');
//   module.exports = require('./metro.release');
// } else {
//   console.log('[Expo Metro] Using DEV config');
//   module.exports = require('./metro.dev');
// }


const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
