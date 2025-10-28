import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function RoutineCompletedScreen() {
  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 p-6 items-center justify-center">
        <Feather name="check-circle" size={100} color="white" />

        <Text className="text-5xl font-bold text-white mt-8 mb-4">
          ¡Felicidades!
        </Text>

        <Text className="text-2xl text-white text-center mb-16">
          Has completado tu rutina.
        </Text>

        <TouchableOpacity
          onPress={handleGoHome}
          className="bg-card p-4 rounded-full items-center justify-center mt-auto w-full"
        >
          <Text className="text-primary text-lg font-bold">
            Volver al inicio
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
