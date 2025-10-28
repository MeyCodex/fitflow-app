import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { DaySelector } from "@/src/components/DaySelector";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";

export default function EditRoutineModal() {
  const { t } = useTranslation();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === routineId)
  );
  const updateRoutine = useRoutineStore((state) => state.updateRoutine);
  const [routineName, setRoutineName] = useState(routine?.name || "");
  const [routineDay, setRoutineDay] = useState(routine?.day || "");

  useEffect(() => {
    if (!routine && routineId) {
      Alert.alert(t("common.error"), t("editRoutine.notFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
    }
  }, [routine, routineId, t]);

  const handleSave = () => {
    if (!routineName.trim()) {
      alert(t("createRoutine.nameRequiredError"));
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
            {t("editRoutine.title")}
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="x" size={28} color="#333333" />
          </TouchableOpacity>
        </View>
        <View className="space-y-6">
          <FormInput
            label={t("createRoutine.nameLabel")}
            value={routineName}
            onChangeText={setRoutineName}
            placeholder={t("createRoutine.namePlaceholder")}
          />
          <DaySelector
            label={t("createRoutine.dayLabel") + ` (${t("common.optional")})`}
            selectedDay={routineDay}
            onSelectDay={setRoutineDay}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">
            {t("editRoutine.saveButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
