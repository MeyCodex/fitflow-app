import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useEffect, useLayoutEffect } from "react";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { showConfirmationAlert } from "@/src/utils/alerts";
import {
  Exercise,
  ExerciseMetrics,
  DurationMetrics,
} from "@/src/types/routine";

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

type ExerciseRowProps = {
  item: Exercise;
  routineId: string;
};

function ExerciseRow({ item, routineId }: ExerciseRowProps) {
  const { t } = useTranslation();
  const deleteExercise = useRoutineStore((state) => state.deleteExercise);

  const handleDeleteClick = () => {
    showConfirmationAlert(
      t("routineDetail.confirmDeleteExerciseTitle"),
      t("routineDetail.confirmDeleteExerciseMessage", { name: item.name }),
      () => deleteExercise(routineId, item.id)
    );
  };

  const handleEditClick = () => {
    router.push({
      pathname: "/edit-exercise",
      params: { routineId: routineId, exerciseId: item.id },
    });
  };

  return (
    <View className="flex-row items-center bg-card p-4 rounded-lg">
      <View className="flex-1">
        <Text className="text-lg font-bold text-text-dark">{item.name}</Text>
        <Text className="text-base text-text-light" numberOfLines={2}>
          {formatMetrics(item.metrics, t) || t("routineDetail.noMetrics")}
        </Text>
      </View>
      <TouchableOpacity onPress={handleEditClick} className="p-2 ml-2">
        <Feather name="edit-2" size={22} color="#666666" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteClick} className="p-2 ml-1">
        <Feather name="trash-2" size={22} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

export default function RoutineDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === id)
  );
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (routine) {
      navigation.setOptions({
        title: routine.name,
        headerBackTitleVisible: false,
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/edit-routine",
                params: { routineId: routine.id },
              })
            }
            style={{ marginRight: 15 }}
          >
            <Feather name="edit-2" size={24} className="text-primary" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, routine]);

  useEffect(() => {
    if (!routine && router.canGoBack()) {
      requestAnimationFrame(() => {
        if (router.canGoBack()) router.back();
      });
    }
  }, [routine]);

  if (!routine) return null;

  const handleAddExercise = () => {
    router.push({
      pathname: "/add-exercise",
      params: { routineId: routine.id },
    });
  };

  const handleDeleteRoutine = () => {
    showConfirmationAlert(
      t("routineDetail.confirmDeleteRoutineTitle"),
      t("routineDetail.confirmDeleteRoutineMessage", { name: routine.name }),
      () => {
        deleteRoutine(routine.id);
        requestAnimationFrame(() => {
          if (router.canGoBack()) {
            router.back();
          }
        });
      }
    );
  };

  const displayDays =
    routine.days.length > 0
      ? routine.days.join(", ")
      : t("routineDetail.noDayAssigned");
  const displaySchedule =
    routine.schedule && routine.schedule !== "any"
      ? t("scheduleSelector." + routine.schedule)
      : "";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        className="flex-1"
        data={routine.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseRow item={item} routineId={routine.id} />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={() => (
          <View className="mb-4">
            <Text className="text-xl font-semibold text-text-dark">
              {t("routineDetail.daysLabel")}: {displayDays}
            </Text>
            {displaySchedule && (
              <Text className="text-lg text-text-light">
                {t("routineDetail.scheduleLabel")}: {displaySchedule}
              </Text>
            )}
            <Text className="text-lg text-text-light mb-4">
              {t("routineDetail.exercisesCount_other", {
                count: routine.exercises.length,
              })}
            </Text>
            <TouchableOpacity
              onPress={handleAddExercise}
              className="flex-row items-center justify-center bg-gray-200 p-3 rounded-lg"
            >
              <Feather name="plus" size={20} color="#333" />
              <Text className="text-text-dark text-base font-bold ml-2">
                {t("routineDetail.addExercise")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="mt-10 mb-20">
            <TouchableOpacity
              onPress={handleDeleteRoutine}
              className="flex-row items-center justify-center bg-danger-light p-3 rounded-lg"
            >
              <Feather name="trash-2" size={22} color="#EF4444" />
              <Text className="text-danger-dark text-base font-bold ml-2">
                {t("routineDetail.deleteRoutine")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-text-light mt-4">
            {t("routineDetail.noExercises")}
          </Text>
        )}
        contentContainerClassName="pl-6 pr-6 pt-4"
      />
      {routine.exercises.length > 0 && (
        <View className="p-6 border-t border-gray-200 bg-background">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/execute/[id]",
                params: { id: routine.id },
              })
            }
            className="bg-primary p-4 rounded-full items-center justify-center"
          >
            <Text className="text-white text-lg font-bold">
              {t("routineDetail.startRoutine")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
