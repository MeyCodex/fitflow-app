import { View } from "react-native";
import { useState } from "react";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { DaySelector } from "@/src/components/DaySelector";
import { FormInput } from "@/src/components/FormInput";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";
import { router } from "expo-router";

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
    <ModalFormLayout
      title={t("createRoutine.title")}
      saveButtonText={t("createRoutine.saveButton")}
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
          label={t("createRoutine.dayLabel")}
          selectedDay={routineDay}
          onSelectDay={setRoutineDay}
        />
      </View>
    </ModalFormLayout>
  );
}
