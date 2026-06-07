import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createAndStartMatch } from '../../services/matchService';
import { useTeamsStore } from '../../stores/teamsStore';
import type { MatchesStackParamList } from '../../types';

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

  const [opponentName, setOpponentName] = useState('');
  const [periodDurationMinutes, setPeriodDurationMinutes] = useState(40);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(15);

  // Dismiss this screen when the user switches away from the Matches tab.
  // parent.blur fires on tab switches only — not on replace() or back press.
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) {
      return () => {};
    }
    const unsubscribe = parent.addListener('blur', () => {
      navigation.popToTop();
    });
    return unsubscribe;
  }, [navigation]);

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
        <Text style={styles.label}>My Team</Text>
        <View style={styles.teamDisplay}>
          <View style={[styles.colourDot, { backgroundColor: homeTeam.colour }]} />
          <Text style={styles.teamName}>{homeTeam.name}</Text>
        </View>
      </View>

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

      <Stepper label="Break duration" value={breakDurationMinutes} onAdjust={adjustBreak} />

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
  teamDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colourDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
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
  startButton: {
    marginTop: 32,
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
