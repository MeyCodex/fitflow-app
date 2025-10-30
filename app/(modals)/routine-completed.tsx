import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { ExerciseLog } from "@/src/types/routine";

export default function RoutineCompletedScreen() {
  const { t } = useTranslation();
  const addWorkoutSession = useRoutineStore((state) => state.addWorkoutSession);
  const params = useLocalSearchParams<{
    routineId?: string;
    routineName?: string;
    startedAt?: string;
    completedAt?: string;
    duration?: string;
    exercisesLogged?: string;
  }>();

  const handleGoHome = () => {
    try {
      const routineId = params.routineId || null;
      const routineName = params.routineName || "Entrenamiento";
      const startedAt = params.startedAt || new Date().toISOString();
      const completedAt = params.completedAt || new Date().toISOString();
      const duration = parseInt(params.duration || "0", 10);
      let exercisesLogged: ExerciseLog[] = [];
      if (params.exercisesLogged) {
        exercisesLogged = JSON.parse(params.exercisesLogged);
        if (!Array.isArray(exercisesLogged)) {
          throw new Error("exercisesLogged no es un array válido.");
        }
      }
      addWorkoutSession({
        routineId,
        routineName,
        startedAt,
        completedAt,
        duration,
        exercisesLogged,
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error al guardar la sesión:", error);
      Alert.alert(
        t("common.error"),
        "Hubo un problema al guardar tu sesión. Por favor, inténtalo de nuevo."
      );
    }
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
