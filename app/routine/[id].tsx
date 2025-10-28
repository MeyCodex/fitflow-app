import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import colors from "tailwindcss/colors";
import { Exercise, useRoutineStore } from "@/src/hooks/useRoutineStore";

type ExerciseRowProps = {
  item: Exercise;
  routineId: string;
  onDelete: (id: string) => void;
};

function ExerciseRow({ item, routineId, onDelete }: ExerciseRowProps) {
  const handleDeleteClick = () => {
    onDelete(item.id);
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

export default function RoutineDetailScreen() {
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

  if (!routine) return null;

  const handleAddExercise = () => {
    router.push({
      pathname: "/add-exercise",
      params: { routineId: routine.id },
    });
  };

  const handleDeleteExerciseWithAlert = (exerciseId: string) => {
    Alert.alert(
      "Eliminar ejercicio",
      "¿Estás segura de que quieres eliminar este ejercicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteExercise(routine.id, exerciseId),
        },
      ]
    );
  };

  const handleDeleteRoutine = () => {
    Alert.alert(
      "Eliminar rutina",
      `¿Estás segura de que quieres eliminar la rutina "${routine.name}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteRoutine(routine.id);
            requestAnimationFrame(() => {
              if (router.canGoBack()) {
                router.back();
              }
            });
          },
        },
      ]
    );
  };

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
              Día: {routine.day || "Sin asignar"}
            </Text>
            <Text className="text-lg text-text-light mb-4">
              {routine.exercises.length} ejercicios
            </Text>
            <TouchableOpacity
              onPress={handleAddExercise}
              className="flex-row items-center justify-center bg-gray-200 p-3 rounded-lg"
            >
              <Feather name="plus" size={20} color="#333" />
              <Text className="text-text-dark text-base font-bold ml-2">
                Añadir ejercicio
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
              <Feather name="trash" size={20} color="#EF4444" />
              <Text className="text-red-600 text-base font-bold ml-2">
                Eliminar rutina
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-text-light mt-4">
            No hay ejercicios. ¡Añade el primero!
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
              Comenzar rutina
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
