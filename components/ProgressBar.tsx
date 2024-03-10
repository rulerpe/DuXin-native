import * as Progress from 'react-native-progress';
import theme from '../theme';
interface ProgressBarProps {
  currentStage: number;
  stages: string[];
}

export default function ProgressBar({ currentStage, stages }: ProgressBarProps) {
  const progressRatio = 1 / stages.length;
  const progress = progressRatio * currentStage;

  return <Progress.Bar progress={progress} width={null} height={30} color={theme.colors.primary} />;
}
