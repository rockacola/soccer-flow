import { HeaderBackButton } from '@react-navigation/elements';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../../constants/theme';
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
    fontSize: 15,
    color: colors.textSecondary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerTitleSeparator: {
    fontSize: 17,
    color: colors.separator,
  },
  headerColourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    backgroundColor: colors.surface,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 17,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  periodNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginHorizontal: 32,
  },
  spacer: {
    flex: 1,
  },
  startButton: {
    marginBottom: 32,
    marginHorizontal: 16,
    backgroundColor: colors.positive,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
