import { HeaderBackButton } from '@react-navigation/elements';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import type { MatchesStackParamList, RootTabParamList } from '../../types';

import Stepper from './Stepper';
import { useMatchSetupScreen } from './useMatchSetupScreen';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchSetup'>;

export default function MatchSetupScreen({ route, navigation }: Props) {
  const { homeTeamId } = route.params;
  const rootNav = useNavigation<NavigationProp<RootTabParamList>>();
  const vm = useMatchSetupScreen(homeTeamId, navigation);
  const { homeTeam } = vm;

  useEffect(
    function syncHeaderOptions() {
      if (!homeTeam) {
        return;
      }
      navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton
            onPress={() =>
              rootNav.navigate('Teams', {
                screen: 'TeamDetail',
                params: { teamId: homeTeamId },
              })
            }
          />
        ),
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText}>New Match</Text>
            <Text style={styles.headerTitleSeparator}>·</Text>
            <View style={[styles.headerColourDot, { backgroundColor: homeTeam.colour }]} />
            <Text style={styles.headerTitleText}>{homeTeam.name}</Text>
          </View>
        ),
      });
    },
    [navigation, homeTeam, rootNav, homeTeamId],
  );

  if (!homeTeam) {
    return (
      <View style={styles.centred}>
        <Text style={styles.errorText}>Team not found.</Text>
      </View>
    );
  }

  const {
    opponentName,
    setOpponentName,
    periodDurationMinutes,
    breakDurationMinutes,
    adjustPeriod,
    adjustBreak,
    handleStart,
  } = vm;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Opponent</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Opponent name (optional)"
          placeholderTextColor={colors.textSecondary}
          value={opponentName}
          onChangeText={setOpponentName}
          keyboardAppearance="dark"
          returnKeyType="done"
          accessibilityLabel="Opponent name"
        />
      </View>

      <Stepper label="Period duration" value={periodDurationMinutes} onAdjust={adjustPeriod} />
      <Text style={styles.periodNote}>2 periods per match</Text>

      <Stepper label="Break duration" value={breakDurationMinutes} onAdjust={adjustBreak} />

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStart}
        accessibilityRole="button"
        accessibilityLabel="Start match"
      >
        <Text style={styles.startButtonText}>Start Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitleText: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  headerTitleSeparator: {
    fontSize: typeScale.title,
    color: colors.separator,
  },
  headerColourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    backgroundColor: colors.surface,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.md,
    padding: spacing.lg,
  },
  label: {
    fontSize: typeScale.sm,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  textInput: {
    fontSize: typeScale.title,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  periodNote: {
    fontSize: typeScale.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 6,
    marginHorizontal: 32,
  },
  spacer: {
    flex: 1,
  },
  startButton: {
    marginBottom: 32,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.positive,
    borderRadius: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
});
