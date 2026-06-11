import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';
import { fonts, typeScale } from '../constants/typography';

export default function SettingsHeaderTitle() {
  return (
    <View style={styles.headerTitle}>
      <MaterialCommunityIcons name="cog-outline" size={20} color={colors.textPrimary} />
      <Text style={styles.headerTitleText}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
});
