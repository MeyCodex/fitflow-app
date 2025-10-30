import { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Feather } from "@expo/vector-icons";
import { getYouTubeVideoId } from "@/src/utils/youtube";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ExerciseLog, ExerciseMetrics } from "@/src/types/routine";
import { ModifyMetricsModal } from "@/src/components/execute/ModifyMetricsModal";

const formatMetrics = (
  metrics: ExerciseMetrics | undefined,
  t: any
): string => {
  if (!metrics) return "";
  const parts: string[] = [];
  if (metrics.sets) parts.push(t("metrics.sets", { count: metrics.sets }));
  if (metrics.reps) parts.push(t("metrics.reps", { count: metrics.reps }));
  if (metrics.weight)
    parts.push(t("metrics.weight", { count: metrics.weight }));
  if (metrics.duration)
    parts.push(t("metrics.duration", { count: metrics.duration }));
  if (metrics.distance)
    parts.push(t("metrics.distance", { count: metrics.distance }));
  return parts.join(" / ");
};

export default function ExecuteRoutineScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === id)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionLogs, setSessionLogs] = useState<ExerciseLog[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isModifyModalVisible, setModifyModalVisible] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (isPaused) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }
    if (!startTime) {
      setStartTime(new Date());
    }
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000) as unknown as NodeJS.Timeout;

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (routine && routine.exercises.length > 0) {
      navigation.setOptions({
        title: t("execute.title", {
          current: currentIndex + 1,
          total: routine.exercises.length,
        }),
        headerBackTitle: t("execute.stopButton"),
      });
    }
  }, [navigation, routine, currentIndex, t]);

  useEffect(() => {
    if (
      (routine === undefined || routine?.exercises.length === 0) &&
      router.canGoBack()
    ) {
      setTimeout(() => {
        Alert.alert(t("common.error"), "Esta rutina no tiene ejercicios.");
        router.back();
      }, 0);
    }
  }, [routine, t]);

  if (!routine || routine.exercises.length === 0) {
    return null;
  }
  const currentExercise = routine.exercises[currentIndex];
  const videoId = useMemo(
    () => getYouTubeVideoId(currentExercise.urlVideo || ""),
    [currentExercise]
  );
  const addLogAndProceed = (log: ExerciseLog) => {
    const nextLogs = [...sessionLogs, log];
    setSessionLogs(nextLogs);

    if (isPaused) {
      setIsPaused(false);
    }

    if (currentIndex < routine.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      const endTime = new Date();
      const durationSeconds = startTime
        ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
        : elapsedTime;
      router.replace({
        pathname: "/routine-completed",
        params: {
          routineId: routine.id,
          routineName: routine.name,
          startedAt: startTime?.toISOString() || new Date().toISOString(),
          completedAt: endTime.toISOString(),
          duration: durationSeconds,
          exercisesLogged: JSON.stringify(nextLogs),
        },
      });
    }
  };

  const handleSkip = () => {
    Alert.alert(
      t("execute.confirmSkipTitle"),
      t("execute.confirmSkipMessage"),
      [
        { text: t("routineDetail.cancelButton"), style: "cancel" },
        {
          text: t("common.ok"),
          style: "destructive",
          onPress: () => {
            const log: ExerciseLog = {
              exerciseId: currentExercise.id,
              name: currentExercise.name,
              type: currentExercise.type,
              plannedMetrics: currentExercise.metrics,
              actualMetrics: {},
              status: "skipped",
            };
            addLogAndProceed(log);
          },
        },
      ]
    );
  };

  const handleModify = () => {
    setModifyModalVisible(true);
  };

  const handleSaveModifiedMetrics = (actualMetrics: ExerciseMetrics) => {
    const log: ExerciseLog = {
      exerciseId: currentExercise.id,
      name: currentExercise.name,
      type: currentExercise.type,
      plannedMetrics: currentExercise.metrics,
      actualMetrics: actualMetrics,
      status: "completed", // Ahora guardamos "completed" ya que este es el flujo principal
    };
    addLogAndProceed(log);
  };
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-center space-x-4 mb-4">
          <Text className="text-2xl font-semibold text-text-light w-20 text-right">
            {formatTime(elapsedTime)}
          </Text>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
            <Feather
              name={isPaused ? "play-circle" : "pause-circle"}
              size={28}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View className="w-full aspect-video rounded-lg overflow-hidden bg-text-dark mb-4">
          {videoId ? (
            <YoutubePlayer play={false} videoId={videoId} height={300} />
          ) : (
            <View className="flex-1 items-center justify-center bg-card">
              <Text className="text-text-light">{t("execute.noVideo")}</Text>
            </View>
          )}
        </View>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-3xl font-bold text-text-dark mb-1">
            {currentExercise.name}
          </Text>
          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-1">
              {t("execute.plannedMetricsTitle")}
            </Text>
            <Text className="text-2xl text-text-dark">
              {formatMetrics(currentExercise.metrics, t)}
            </Text>
          </View>

          {/* --- 🎨 NUEVO LAYOUT DE BOTONES (SIMPLIFICADO) --- */}
          <View className="space-y-3 mt-4">
            {/* 1. Botón Principal (Abre el modal) */}
            <TouchableOpacity
              onPress={handleModify}
              className="bg-primary p-4 rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">
                {currentIndex === routine.exercises.length - 1
                  ? t("execute.finishButton")
                  : t("execute.nextButton")}
              </Text>
            </TouchableOpacity>

            {/* 2. Botón Secundario (Saltar) */}
            <TouchableOpacity
              onPress={handleSkip}
              className="bg-gray-200 p-4 rounded-full items-center justify-center"
            >
              <Text className="text-text-dark text-base font-bold">
                {t("execute.skipButton")}
              </Text>
            </TouchableOpacity>
          </View>
          {/* --- FIN LAYOUT DE BOTONES --- */}
        </ScrollView>

        <ModifyMetricsModal
          visible={isModifyModalVisible}
          onClose={() => setModifyModalVisible(false)}
          plannedMetrics={currentExercise.metrics || {}}
          exerciseType={currentExercise.type}
          onSubmit={handleSaveModifiedMetrics}
          t={t}
        />
      </View>
    </SafeAreaView>
  );
}
