import { View, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { DaySelector } from "@/src/components/DaySelector";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";

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
    <ModalFormLayout
      title={t("editRoutine.title")}
      saveButtonText={t("editRoutine.saveButton")}
      onSave={handleSave}
    >
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
    </ModalFormLayout>
  );
}
