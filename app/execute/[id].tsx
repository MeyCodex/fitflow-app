import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo, useEffect } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { getYouTubeVideoId } from "@/src/utils/youtube";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";

export default function ExecuteRoutineScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === id)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (routine) {
      navigation.setOptions({
        title: t("execute.title", {
          current: currentIndex + 1,
          total: routine.exercises.length,
        }),
        headerBackTitle: t("execute.stopButton"),
      });
    }
  }, [navigation, routine, currentIndex, t]);

  if (!routine || routine.exercises.length === 0) {
    useEffect(() => {
      if ((!routine || routine.exercises.length === 0) && router.canGoBack()) {
        router.back();
      }
    }, [routine]);
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
      <View className="flex-1 p-6">
        <View className="w-full aspect-video rounded-lg overflow-hidden bg-text-dark mb-6">
          {videoId ? (
            <YoutubePlayer play={false} videoId={videoId} height={300} />
          ) : (
            <View className="flex-1 items-center justify-center bg-card">
              <Text className="text-text-light">{t("execute.noVideo")}</Text>
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
              ? t("execute.finishButton")
              : t("execute.nextButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
