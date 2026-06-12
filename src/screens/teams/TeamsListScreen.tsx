import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ScreenBackground from '../../components/ScreenBackground';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { useTeamsStore } from '../../stores/teamsStore';
import type { TeamsStackParamList } from '../../types';

import CreateTeamModal from './CreateTeamModal';
import TeamRow from './TeamRow';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamsList'>;

export default function TeamsListScreen({ navigation }: Props) {
  const teams = useTeamsStore((s) => s.teams);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(
    function syncHeaderButton() {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)} accessibilityRole="button">
            <Text style={styles.headerButton}>Add</Text>
          </TouchableOpacity>
        ),
      });
    },
    [navigation],
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TeamRow team={item} />}
          contentContainerStyle={teams.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>
                No teams yet. Create your first team to get started.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
                accessibilityRole="button"
              >
                <Text style={styles.emptyButtonLabel}>Add Team</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <CreateTeamModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  emptyText: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  emptyButtonLabel: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  headerButton: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  },
});
