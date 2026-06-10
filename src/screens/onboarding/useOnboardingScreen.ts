import { loadSampleData } from '../../services/sampleDataService';
import { useAppStore } from '../../stores/appStore';

type OnboardingScreenHook = {
  onLoadSampleData: () => void;
  onSkip: () => void;
};

export function useOnboardingScreen(): OnboardingScreenHook {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  function onLoadSampleData() {
    loadSampleData();
    completeOnboarding();
  }

  function onSkip() {
    completeOnboarding();
  }

  return { onLoadSampleData, onSkip };
}
