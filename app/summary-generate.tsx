import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import SummaryDetail, { SummaryDetailType } from "../components/SummaryDetail";
import ButtonComponent from "../components/ButtonComponent";
import { useTakePhoto } from "../hooks/useTakePhoto";
import theme from "../theme";
const summaryMock: SummaryDetailType = {
  title: "NVEnergy Bill Summary",
  body: "该信函提供了收件人的电力使用历史、当前账单金额和付款选项的摘要。",
  action:
    "收件人需要查看账单详细信息，在2015年7月7日前支付104.70美元，并考虑在nvenergy.com上注册无纸化账单。",
};
export default function SummaryGeneratePage() {
  const { image, takePhoto } = useTakePhoto();
  const [isUploading, setIsUploading] = useState(false);
  const [stage, setStage] = useState(0);
  const [summary, setSummary] = useState<SummaryDetailType | null>(null);

  const mockProgress = async () => {
    let interval = await setInterval(changeStage, 1000);
    function changeStage() {
      if (stage > 1) {
        clearInterval(interval);
      }
      setStage((pre) => pre + 0.3);
    }
    setSummary(summaryMock);
  };
  useEffect(() => {
    mockProgress();
  }, []);

  useEffect(() => {
    if (image) {
      setStage(0);
      setSummary(null);
      mockProgress();
    }
  }, [image]);

  return (
    <View style={styles.summaryGeneratePageWrapper}>
      {stage > 1.3 && summary ? (
        <View>
          <SummaryDetail summary={summary} />
          <View style={styles.photoButtonWrapper}>
            <ButtonComponent
              label="Take a photo"
              onPress={takePhoto}
              isLoading={isUploading}
            />
          </View>
        </View>
      ) : (
        <View style={styles.progressBarWrapper}>
          <Progress.Bar
            progress={stage}
            width={null}
            height={30}
            color={theme.colors.primary}
          />
          <Text style={styles.progressText}>Current stage: {stage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryGeneratePageWrapper: {
    paddingHorizontal: 15,
    width: "100%",
  },
  progressBarWrapper: {
    // flex: 1,
  },
  progressText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: theme.font.large,
  },
  photoButtonWrapper: {
    marginTop: 30,
  },
});
