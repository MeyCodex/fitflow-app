import { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Feather } from "@expo/vector-icons";
import { getYouTubeVideoId } from "@/src/utils/youtube";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import {
  ExerciseLog,
  ExerciseMetrics,
  DurationMetrics,
} from "@/src/types/routine";
import { ModifyMetricsModal } from "@/src/components/execute/ModifyMetricsModal";
import { useAlertStore } from "@/src/hooks/useAlertStore";
import { showConfirmationAlert } from "@/src/utils/alerts";

const formatDuration = (duration: DurationMetrics): string | null => {
  const { hours, minutes, seconds } = duration;
  const timeParts: string[] = [];
  if (hours && Number(hours) > 0) timeParts.push(`${Number(hours)}h`);
  if (minutes && Number(minutes) > 0) timeParts.push(`${Number(minutes)}m`);
  if (seconds && Number(seconds) > 0) timeParts.push(`${Number(seconds)}s`);
  return timeParts.length > 0 ? timeParts.join(" ") : null;
};

const formatMetrics = (
  metrics: ExerciseMetrics | undefined,
  t: any
): string => {
  if (!metrics) return "";
  const parts: string[] = [];

  if (metrics.sets) {
    parts.push(t("metrics.sets_other", { count: Number(metrics.sets) }));
  }
  if (metrics.reps) {
    parts.push(t("metrics.reps_other", { count: Number(metrics.reps) }));
  }
  if (metrics.weight) {
    const unit = metrics.weightUnit
      ? t(`metrics.units.${metrics.weightUnit}`)
      : "";
    parts.push(t("metrics.weight_unit", { count: metrics.weight, unit: unit }));
  }
  if (metrics.duration) {
    const durationString = formatDuration(metrics.duration);
    if (durationString) parts.push(durationString);
  }
  if (metrics.distance) {
    parts.push(
      t("metrics.distance_other", { count: Number(metrics.distance) })
    );
  }

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
        useAlertStore.getState().alert({
          title: t("common.error"),
          message: "Esta rutina no tiene ejercicios.",
          buttons: [{ text: t("common.ok"), onPress: () => router.back() }],
        });
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
      setIsPaused(true);
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
    showConfirmationAlert(
      t("execute.confirmSkipTitle"),
      t("execute.confirmSkipMessage"),
      () => {
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
      t("common.skip"),
      t("common.cancel")
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
      status: "completed",
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
      <View className="flex-1">
        <View className="flex-row items-center justify-center space-x-4 pt-4 px-6">
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
        <View className="w-full aspect-video rounded-lg overflow-hidden bg-text-dark my-4">
          {videoId ? (
            <YoutubePlayer play={false} videoId={videoId} height={300} />
          ) : (
            <View className="flex-1 items-center justify-center bg-card">
              <Text className="text-text-light">{t("execute.noVideo")}</Text>
            </View>
          )}
        </View>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pb-6"
        >
          <Text className="text-3xl font-bold text-text-dark mb-4">
            {currentExercise.name}
          </Text>
          <View className="bg-card p-4 rounded-lg mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-primary mb-1">
              {t("execute.plannedMetricsTitle")}
            </Text>
            <Text className="text-2xl text-text-dark">
              {formatMetrics(currentExercise.metrics, t)}
            </Text>
          </View>
          <View className="space-y-3 mt-4">
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

            <TouchableOpacity
              onPress={handleSkip}
              className="bg-gray-200 p-4 rounded-full items-center justify-center"
            >
              <Text className="text-text-dark text-base font-bold">
                {t("execute.skipButton")}
              </Text>
            </TouchableOpacity>
          </View>
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
