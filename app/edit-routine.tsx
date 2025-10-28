import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { DaySelector } from "@/src/components/DaySelector";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";

export default function EditRoutineModal() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === routineId)
  );
  const updateRoutine = useRoutineStore((state) => state.updateRoutine);
  const [routineName, setRoutineName] = useState(routine?.name || "");
  const [routineDay, setRoutineDay] = useState(routine?.day || "");
  useEffect(() => {
    if (!routine) {
      Alert.alert("Error", "No se encontró la rutina para editar.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [routine]);

  const handleSave = () => {
    if (!routineName.trim()) {
      alert("Por favor, ingresa un nombre para la rutina.");
      return;
    }
    if (!routineId) return;
    updateRoutine(routineId, { name: routineName, day: routineDay });
    router.back();
  };

  if (!routine) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">
            Editar rutina
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="x" size={28} color="#333333" />
          </TouchableOpacity>
        </View>
        <View className="space-y-6">
          <FormInput
            label="Nombre de la rutina"
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="Ej: Piernas + Glúteos"
          />
          <DaySelector
            label="Día (Opcional)"
            selectedDay={routineDay}
            onSelectDay={setRoutineDay}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
