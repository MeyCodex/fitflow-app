import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { FormInput } from "../src/components/FormInput";
import { useRoutineStore } from "../src/hooks/useRoutineStore";

export default function AddExerciseModal() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const addExerciseToRoutine = useRoutineStore(
    (state) => state.addExerciseToRoutine
  );

  const handleSave = () => {
    if (!exerciseName.trim() || !reps.trim()) {
      alert("Por favor, completa el nombre y las repeticiones.");
      return;
    }
    if (!routineId) {
      alert("Error: No se encontró la rutina.");
      router.back();
      return;
    }
    addExerciseToRoutine(routineId, {
      name: exerciseName,
      reps: reps,
      urlVideo: videoUrl,
    });

    console.log("Ejercicio guardado en rutina:", routineId);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">
            Nuevo Ejercicio
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="x" size={28} color="#333333" />
          </TouchableOpacity>
        </View>
        <View className="space-y-6">
          <FormInput
            label="Nombre del ejercicio"
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder="Ej: Sentadillas"
          />
          <FormInput
            label="Repeticiones"
            value={reps}
            onChangeText={setReps}
            placeholder="Ej: 3x12"
          />
          <FormInput
            label="URL de Video (YouTube)"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">Añadir ejercicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
