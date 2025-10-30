import { View, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { FormInput } from "@/src/components/FormInput";
import { ExerciseTypeSelector } from "@/src/components/ExerciseTypeSelector";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";
import { ExerciseType, ExerciseMetrics } from "@/src/types/routine";

export default function EditExerciseModal() {
  const { t } = useTranslation();
  const { routineId, exerciseId } = useLocalSearchParams<{
    routineId: string;
    exerciseId: string;
  }>();
  //Encontrar ejercicio
  const exercise = useRoutineStore((state) =>
    state.routines
      .find((r) => r.id === routineId)
      ?.exercises.find((ex) => ex.id === exerciseId)
  );
  const updateExercise = useRoutineStore((state) => state.updateExercise);
  const [exerciseName, setExerciseName] = useState(exercise?.name || "");
  const [exerciseType, setExerciseType] = useState<ExerciseType>(
    exercise?.type || "strength"
  );
  const [videoUrl, setVideoUrl] = useState(exercise?.urlVideo || "");
  // Métricas
  const [sets, setSets] = useState(String(exercise?.metrics?.sets || ""));
  const [reps, setReps] = useState(String(exercise?.metrics?.reps || ""));
  const [weight, setWeight] = useState(String(exercise?.metrics?.weight || ""));
  const [duration, setDuration] = useState(
    String(exercise?.metrics?.duration || "")
  );
  const [distance, setDistance] = useState(
    String(exercise?.metrics?.distance || "")
  );

  useEffect(() => {
    if (!exercise && routineId && exerciseId) {
      Alert.alert(t("common.error"), t("editExercise.notFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
    } else if (exercise) {
      setExerciseName(exercise.name);
      setExerciseType(exercise.type || "strength");
      setVideoUrl(exercise.urlVideo || "");
      setSets(String(exercise.metrics?.sets || ""));
      setReps(String(exercise.metrics?.reps || ""));
      setWeight(String(exercise.metrics?.weight || ""));
      setDuration(String(exercise.metrics?.duration || ""));
      setDistance(String(exercise.metrics?.distance || ""));
    }
  }, [exercise, routineId, exerciseId, t]);

  const handleSave = () => {
    const hasMetrics =
      (exerciseType === "strength" && (sets || reps || weight)) ||
      (exerciseType === "cardio" && (duration || distance)) ||
      (exerciseType === "stretch" && duration) ||
      (exerciseType === "other" &&
        (sets || reps || weight || duration || distance));

    if (!exerciseName.trim() || !hasMetrics) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    if (!routineId || !exerciseId) return;
    const metrics: ExerciseMetrics = {};
    if (sets) metrics.sets = sets;
    if (reps) metrics.reps = reps;
    if (weight) metrics.weight = weight;
    if (duration) metrics.duration = parseInt(duration, 10) || undefined;
    if (distance) metrics.distance = parseInt(distance, 10) || undefined;

    updateExercise(routineId, exerciseId, {
      name: exerciseName,
      type: exerciseType,
      metrics: metrics,
      urlVideo: videoUrl,
    });
    router.back();
  };

  if (!exercise) {
    return null;
  }

  return (
    <ModalFormLayout
      title={t("editExercise.title")}
      saveButtonText={t("editExercise.saveButton")}
      onSave={handleSave}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="space-y-6 pb-6">
          <FormInput
            label={t("addExercise.nameLabel")}
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder={t("addExercise.namePlaceholder")}
          />

          <ExerciseTypeSelector
            label={t("addExercise.typeLabel")}
            selectedValue={exerciseType}
            onValueChange={setExerciseType}
          />
          {(exerciseType === "strength" || exerciseType === "other") && (
            <>
              <FormInput
                label={t("addExercise.metricsSetsLabel")}
                value={sets}
                onChangeText={setSets}
                placeholder={t("addExercise.metricsSetsPlaceholder")}
                keyboardType="numeric"
              />
              <FormInput
                label={t("addExercise.metricsRepsLabel")}
                value={reps}
                onChangeText={setReps}
                placeholder={t("addExercise.metricsRepsPlaceholder")}
              />
              <FormInput
                label={t("addExercise.metricsWeightLabel")}
                value={weight}
                onChangeText={setWeight}
                placeholder={t("addExercise.metricsWeightPlaceholder")}
              />
            </>
          )}
          {(exerciseType === "cardio" || exerciseType === "other") && (
            <>
              <FormInput
                label={t("addExercise.metricsDurationLabel")}
                value={duration}
                onChangeText={setDuration}
                placeholder={t("addExercise.metricsDurationPlaceholder")}
                keyboardType="numeric"
              />
              <FormInput
                label={t("addExercise.metricsDistanceLabel")}
                value={distance}
                onChangeText={setDistance}
                placeholder={t("addExercise.metricsDistancePlaceholder")}
                keyboardType="numeric"
              />
            </>
          )}
          {exerciseType === "stretch" && (
            <FormInput
              label={t("addExercise.metricsDurationLabel")}
              value={duration}
              onChangeText={setDuration}
              placeholder={t("addExercise.metricsDurationPlaceholder")}
              keyboardType="numeric"
            />
          )}

          <FormInput
            label={
              t("addExercise.videoUrlLabel") + ` (${t("common.optional")})`
            }
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder={t("addExercise.videoUrlPlaceholder")}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>
    </ModalFormLayout>
  );
}
