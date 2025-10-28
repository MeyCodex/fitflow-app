import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function StatsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-text-dark mb-6">
          {t("stats.title")}
        </Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-text-light">
            {t("stats.comingSoon")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
