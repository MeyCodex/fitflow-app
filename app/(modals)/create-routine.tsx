import { View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { MultiDaySelector } from "@/src/components/MultiDaySelector";
import { ScheduleSelector } from "@/src/components/ScheduleSelector";
import { FormInput } from "@/src/components/FormInput";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";
import { RoutineSchedule } from "@/src/types/routine";

export default function CreateRoutineModal() {
  const { t } = useTranslation();
  const [routineName, setRoutineName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<RoutineSchedule>("any");
  const addRoutine = useRoutineStore((state) => state.addRoutine);

  const handleSave = () => {
    if (!routineName.trim()) {
      alert(t("createRoutine.nameRequiredError"));
      return;
    }
    addRoutine(routineName, selectedDays, schedule);
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
        <MultiDaySelector
          label={t("createRoutine.daysLabel")}
          selectedDays={selectedDays}
          onSelectionChange={setSelectedDays}
        />
        <ScheduleSelector
          label={
            t("createRoutine.scheduleLabel") + ` (${t("common.optional")})`
          }
          selectedValue={schedule}
          onValueChange={setSchedule}
        />
      </View>
    </ModalFormLayout>
  );
}
