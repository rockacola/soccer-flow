import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ImageBackground, StyleSheet } from 'react-native';

import { colors } from '../constants/theme';

const defaultSource = require('../../assets/bg-default.png');

type Props = {
  children: React.ReactNode;
  source?: ImageSourcePropType;
};

export default function ScreenBackground({ children, source }: Props) {
  return (
    <ImageBackground source={source ?? defaultSource} style={styles.container} resizeMode="cover">
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
