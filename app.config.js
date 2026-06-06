const { version } = require('./package.json');

module.exports = {
  expo: {
    name: 'SoccerFlow',
    slug: 'soccer-flow',
    version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.travaganza.soccerflow',
      buildNumber: '1',
      supportsTabletMode: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    plugins: ['expo-font', 'expo-asset'],
    extra: {
      eas: {
        projectId: 'b0d48e41-9eab-4e61-9bda-56c84137b4ef',
      },
    },
  },
};
