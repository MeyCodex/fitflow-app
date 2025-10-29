import { View, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";

export default function EditExerciseModal() {
  const { t } = useTranslation();
  const { routineId, exerciseId } = useLocalSearchParams<{
    routineId: string;
    exerciseId: string;
  }>();
  const exercise = useRoutineStore((state) =>
    state.routines
      .find((r) => r.id === routineId)
      ?.exercises.find((ex) => ex.id === exerciseId)
  );
  const updateExercise = useRoutineStore((state) => state.updateExercise);
  const [exerciseName, setExerciseName] = useState(exercise?.name || "");
  const [reps, setReps] = useState(exercise?.reps || "");
  const [videoUrl, setVideoUrl] = useState(exercise?.urlVideo || "");

  useEffect(() => {
    if (!exercise && routineId && exerciseId) {
      Alert.alert(t("common.error"), t("editExercise.notFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
    } else if (exercise) {
      setExerciseName(exercise.name);
      setReps(exercise.reps);
      setVideoUrl(exercise.urlVideo || "");
    }
  }, [exercise, routineId, exerciseId, t]);

  const handleSave = () => {
    if (!exerciseName.trim() || !reps.trim()) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    if (!routineId || !exerciseId) return;
    updateExercise(routineId, exerciseId, {
      name: exerciseName,
      reps: reps,
      urlVideo: videoUrl,
    });
    router.back();
  };

  if (!exercise) return null;

  return (
    <ModalFormLayout
      title={t("editExercise.title")}
      saveButtonText={t("editExercise.saveButton")}
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
