import { View, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";

export default function AddExerciseModal() {
  const { t } = useTranslation();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const addExerciseToRoutine = useRoutineStore(
    (state) => state.addExerciseToRoutine
  );

  const handleSave = () => {
    if (!exerciseName.trim() || !reps.trim()) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    if (!routineId) {
      Alert.alert(t("common.error"), t("addExercise.routineNotFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
      return;
    }
    addExerciseToRoutine(routineId, {
      name: exerciseName,
      reps: reps,
      urlVideo: videoUrl,
    });
    router.back();
  };

  return (
    <ModalFormLayout
      title={t("addExercise.title")}
      saveButtonText={t("addExercise.saveButton")}
      onSave={handleSave}
    >
      <View className="space-y-6">
        <FormInput
          label={t("addExercise.nameLabel")}
          value={exerciseName}
          onChangeText={setExerciseName}
          placeholder={t("addExercise.namePlaceholder")}
        />
        <FormInput
          label={t("addExercise.repsLabel")}
          value={reps}
          onChangeText={setReps}
          placeholder={t("addExercise.repsPlaceholder")}
        />
        <FormInput
          label={t("addExercise.videoUrlLabel")}
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder={t("addExercise.videoUrlPlaceholder")}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
    </ModalFormLayout>
  );
}
