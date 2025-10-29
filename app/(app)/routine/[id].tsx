import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useEffect, useLayoutEffect } from "react";
import colors from "tailwindcss/colors";
import { Exercise, useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { showConfirmationAlert } from "@/src/utils/alerts";

type ExerciseRowProps = {
  item: Exercise;
  routineId: string;
  onDelete: (id: string) => void;
};

export default function RoutineDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);
  const deleteExercise = useRoutineStore((state) => state.deleteExercise);
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
            <Feather name="edit-2" size={24} color={colors.green[600]} />
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

  const handleDeleteExerciseWithAlert = (exerciseId: string) => {
    const exerciseName =
      routine.exercises.find((ex) => ex.id === exerciseId)?.name ||
      "este ejercicio";
    showConfirmationAlert(
      t("routineDetail.confirmDeleteExerciseTitle"),
      t("routineDetail.confirmDeleteExerciseMessage", { name: exerciseName }),
      () => deleteExercise(routine.id, exerciseId)
    );
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

  function ExerciseRow({ item, routineId }: ExerciseRowProps) {
    const handleDeleteClick = () => {
      handleDeleteExerciseWithAlert(item.id);
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
          <Text className="text-base text-text-light">{item.reps}</Text>
        </View>
        <TouchableOpacity onPress={handleEditClick} className="p-2 ml-2">
          <Feather name="edit-2" size={22} color={colors.gray[500]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteClick} className="p-2 ml-1">
          <Feather name="trash-2" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseRow
            item={item}
            routineId={routine.id}
            onDelete={handleDeleteExerciseWithAlert}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={() => (
          <View className="mb-4">
            <Text className="text-xl font-semibold text-text-dark">
              {t("routineDetail.dayLabel", {
                day: routine.day || t("routineDetail.noDayAssigned"),
              })}
            </Text>
            <Text className="text-lg text-text-light mb-4">
              {t("routineDetail.exercisesCount", {
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
              className="flex-row items-center justify-center bg-red-100 p-3 rounded-lg"
            >
              <Feather name="trash-2" size={22} color="#EF4444" />
              <Text className="text-red-600 text-base font-bold ml-2">
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
        contentContainerClassName="p-6"
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
