import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import type { Team, TeamsStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<TeamsStackParamList, 'TeamsList'>;

type Props = {
  team: Team;
};

export default function TeamRow({ team }: Props) {
  const navigation = useNavigation<Nav>();

  function handlePress() {
    navigation.navigate('TeamDetail', { teamId: team.id });
  }

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={team.name}
    >
      <View style={[styles.colourDot, { backgroundColor: team.colour }]} />
      <View style={styles.rowText}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.playerCount}>{team.players.length} players</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    backgroundColor: colors.background,
  },
  colourDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  teamName: {
    fontSize: typeScale.input,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  playerCount: {
    fontSize: typeScale.base,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: typeScale.lg,
    color: colors.separator,
  },
});
