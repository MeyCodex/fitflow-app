import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { DaySelector } from "@/src/components/DaySelector";
import { FormInput } from "@/src/components/FormInput";
import { useTranslation } from "react-i18next";

export default function CreateRoutineModal() {
  const { t } = useTranslation();
  const [routineName, setRoutineName] = useState("");
  const [routineDay, setRoutineDay] = useState("");
  const addRoutine = useRoutineStore((state) => state.addRoutine);

  const handleSave = () => {
    if (!routineName.trim()) {
      alert(t("createRoutine.nameRequiredError"));
      return;
    }
    addRoutine(routineName, routineDay);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">
            {t("createRoutine.title")}
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
            label={t("createRoutine.dayLabel")}
            selectedDay={routineDay}
            onSelectDay={setRoutineDay}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">
            {t("createRoutine.saveButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
