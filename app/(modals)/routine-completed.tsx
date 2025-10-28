import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function RoutineCompletedScreen() {
  const { t } = useTranslation();

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 p-6 items-center justify-center">
        <Feather name="check-circle" size={100} color="white" />

        <Text className="text-5xl font-bold text-white mt-8 mb-4">
          {t("routineCompleted.title")}
        </Text>

        <Text className="text-2xl text-white text-center mb-16">
          {t("routineCompleted.message")}
        </Text>

        <TouchableOpacity
          onPress={handleGoHome}
          className="bg-card p-4 rounded-full items-center justify-center mt-auto w-full"
        >
          <Text className="text-primary text-lg font-bold">
            {t("routineCompleted.goHomeButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
