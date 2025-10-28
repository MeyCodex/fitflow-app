import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { getYouTubeVideoId } from "@/src/utils/youtube";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";

export default function ExecuteRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === id)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!routine || routine.exercises.length === 0) {
    router.back();
    return null;
  }
  const currentExercise = routine.exercises[currentIndex];
  const videoId = useMemo(
    () => getYouTubeVideoId(currentExercise.urlVideo),
    [currentExercise]
  );

  const handleNext = () => {
    if (currentIndex < routine.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/routine-completed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Ejercicio ${currentIndex + 1} de ${routine.exercises.length}`,
          headerBackTitle: "Detener",
        }}
      />
      <View className="flex-1 p-6">
        <View className="w-full aspect-video rounded-lg overflow-hidden bg-text-dark mb-6">
          {videoId ? (
            <YoutubePlayer height={300} play={false} videoId={videoId} />
          ) : (
            <View className="flex-1 items-center justify-center bg-card">
              <Text className="text-text-light">No hay video</Text>
            </View>
          )}
        </View>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-text-dark mb-2">
            {currentExercise.name}
          </Text>
          <Text className="text-5xl font-bold text-primary">
            {currentExercise.reps}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === routine.exercises.length - 1
              ? "Finalizar rutina"
              : "Siguiente ejercicio"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
