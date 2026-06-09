import { HeaderBackButton } from '@react-navigation/elements';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createAndStartMatch } from '../../services/matchService';
import { useTeamsStore } from '../../stores/teamsStore';
import type { MatchesStackParamList, RootTabParamList } from '../../types';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchSetup'>;

function Stepper({
  label,
  value,
  onAdjust,
}: {
  label: string;
  value: number;
  onAdjust: (delta: number) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperButton} onPress={() => onAdjust(-5)}>
          <Text style={styles.stepperButtonText}>−5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stepperButton} onPress={() => onAdjust(-1)}>
          <Text style={styles.stepperButtonText}>−1</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value} min</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={() => onAdjust(1)}>
          <Text style={styles.stepperButtonText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stepperButton} onPress={() => onAdjust(5)}>
          <Text style={styles.stepperButtonText}>+5</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MatchSetupScreen({ route, navigation }: Props) {
  const { homeTeamId } = route.params;
  const teams = useTeamsStore((s) => s.teams);
  const homeTeam = teams.find((t) => t.id === homeTeamId);

  const rootNav = useNavigation<NavigationProp<RootTabParamList>>();
  const [opponentName, setOpponentName] = useState('');
  const [periodDurationMinutes, setPeriodDurationMinutes] = useState(40);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(15);

  useEffect(
    function dismissOnTabBlur() {
      const parent = navigation.getParent();
      if (!parent) {
        return () => {};
      }
      const unsubscribe = parent.addListener('blur', () => {
        navigation.popToTop();
      });
      return unsubscribe;
    },
    [navigation],
  );

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
    [navigation, homeTeam, homeTeamId, rootNav],
  );

  const adjustPeriod = (delta: number) => {
    setPeriodDurationMinutes((m) => Math.min(90, Math.max(1, m + delta)));
  };

  const adjustBreak = (delta: number) => {
    setBreakDurationMinutes((m) => Math.min(30, Math.max(1, m + delta)));
  };

  const handleStart = () => {
    try {
      createAndStartMatch(homeTeamId, opponentName, 2, periodDurationMinutes, breakDurationMinutes);
      navigation.replace('MatchLive');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not start match.');
    }
  };

  if (!homeTeam) {
    return (
      <View style={styles.centred}>
        <Text style={styles.errorText}>Team not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Opponent</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Opponent name (optional)"
          placeholderTextColor="#8E8E93"
          value={opponentName}
          onChangeText={setOpponentName}
          returnKeyType="done"
        />
      </View>

      <Stepper label="Period duration" value={periodDurationMinutes} onAdjust={adjustPeriod} />
      <Text style={styles.periodNote}>2 periods per match</Text>

      <Stepper label="Break duration" value={breakDurationMinutes} onAdjust={adjustBreak} />

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerTitleSeparator: {
    fontSize: 17,
    color: '#C6C6C8',
  },
  headerColourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 17,
    color: '#000000',
    paddingVertical: 0,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    lineHeight: 24,
  },
  stepperValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    minWidth: 64,
    textAlign: 'center',
  },
  periodNote: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
    marginHorizontal: 32,
  },
  spacer: {
    flex: 1,
  },
  startButton: {
    marginBottom: 32,
    marginHorizontal: 16,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
