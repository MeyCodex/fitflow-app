import { View, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { MultiDaySelector } from "@/src/components/MultiDaySelector";
import { ScheduleSelector } from "@/src/components/ScheduleSelector";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";
import { RoutineSchedule } from "@/src/types/routine";

export default function EditRoutineModal() {
  const { t } = useTranslation();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  const routine = useRoutineStore((state) =>
    state.routines.find((r) => r.id === routineId)
  );
  const updateRoutine = useRoutineStore((state) => state.updateRoutine);

  const [routineName, setRoutineName] = useState(routine?.name || "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    routine?.days || []
  );
  const [schedule, setSchedule] = useState<RoutineSchedule>(
    routine?.schedule || "any"
  );

  useEffect(() => {
    if (!routine && routineId) {
      Alert.alert(t("common.error"), t("editRoutine.notFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
    } else if (routine) {
      setRoutineName(routine.name);
      setSelectedDays(routine.days || []);
      setSchedule(routine.schedule || "any");
    }
  }, [routine, routineId, t]);

  const handleSave = () => {
    if (!routineName.trim()) {
      alert(t("createRoutine.nameRequiredError"));
      return;
    }
    if (!routineId) return;

    updateRoutine(routineId, {
      name: routineName,
      days: selectedDays,
      schedule: schedule,
    });
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
