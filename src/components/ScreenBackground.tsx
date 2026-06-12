import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { colors } from '../constants/theme';

const sources = {
  default: require('../../assets/bg-default.png'),
  match: require('../../assets/bg-match.png'),
  player: require('../../assets/bg-player.png'),
  settings: require('../../assets/bg-settings.png'),
} as const;

type Variant = keyof typeof sources;

type Props = {
  children: React.ReactNode;
  variant?: Variant;
};

export default function ScreenBackground({ children, variant = 'default' }: Props) {
  return (
    <ImageBackground source={sources[variant]} style={styles.container} resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
