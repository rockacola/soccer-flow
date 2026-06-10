import { Alert } from 'react-native';

import { resetAllData } from '../../services/appService';
import { loadSampleData, removeSampleData } from '../../services/sampleDataService';
import { useAppStore } from '../../stores/appStore';

type SettingsScreenHook = {
  hasSampleData: boolean;
  onToggleSampleData: () => void;
  onResetAll: () => void;
};

export function useSettingsScreen(): SettingsScreenHook {
  const hasSampleData = useAppStore((s) => s.hasSampleData);

  function onToggleSampleData() {
    if (hasSampleData) {
      removeSampleData();
    } else {
      loadSampleData();
    }
  }

  function onResetAll() {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all teams, matches, and settings. The app will return to the welcome screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAllData },
      ],
    );
  }

  return { hasSampleData, onToggleSampleData, onResetAll };
}
