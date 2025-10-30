import { View, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FormInput } from "@/src/components/FormInput";
import { ExerciseTypeSelector } from "@/src/components/ExerciseTypeSelector";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";
import { ModalFormLayout } from "@/src/components/ModalFormLayout";
import {
  ExerciseType,
  ExerciseMetrics,
  WeightUnit,
  DurationMetrics,
} from "@/src/types/routine";
import { WeightInput } from "@/src/components/form/WeightInput";
import { DurationInput } from "@/src/components/form/DurationInput";

const initialDuration = { hours: "", minutes: "", seconds: "" };

export default function AddExerciseModal() {
  const { t } = useTranslation();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>("strength");
  const [videoUrl, setVideoUrl] = useState("");
  // Métricas
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [duration, setDuration] = useState<DurationMetrics>(initialDuration);
  const [distance, setDistance] = useState("");

  const addExerciseToRoutine = useRoutineStore(
    (state) => state.addExerciseToRoutine
  );

  const handleSave = () => {
    const { hours, minutes, seconds } = duration;
    const durationIsSet = !!(hours || minutes || seconds);

    const hasMetrics =
      (exerciseType === "strength" && (sets || reps || weight)) ||
      (exerciseType === "cardio" && (durationIsSet || distance)) ||
      (exerciseType === "stretch" && durationIsSet) ||
      (exerciseType === "other" &&
        (sets || reps || weight || durationIsSet || distance));

    if (!exerciseName.trim() || !hasMetrics) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    if (!routineId) {
      Alert.alert(t("common.error"), t("addExercise.routineNotFoundError"), [
        { text: t("common.ok"), onPress: () => router.back() },
      ]);
      return;
    }

    // Guardar
    const metrics: ExerciseMetrics = {};
    if (sets) metrics.sets = sets;
    if (reps) metrics.reps = reps;
    if (weight) {
      metrics.weight = weight;
      metrics.weightUnit = weightUnit;
    }
    if (durationIsSet) {
      metrics.duration = duration;
    }
    if (distance) metrics.distance = parseInt(distance, 10) || 0;

    addExerciseToRoutine(routineId, {
      name: exerciseName,
      type: exerciseType,
      metrics: metrics,
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
              <WeightInput
                label={t("addExercise.metricsWeightLabel")}
                value={weight}
                unit={weightUnit}
                onChangeText={setWeight}
                onUnitChange={setWeightUnit}
              />
            </>
          )}

          {(exerciseType === "cardio" ||
            exerciseType === "stretch" ||
            exerciseType === "other") && (
            <DurationInput
              label={t("addExercise.metricsDurationLabel")}
              value={duration}
              onChange={setDuration}
            />
          )}

          {(exerciseType === "cardio" || exerciseType === "other") && (
            <FormInput
              label={t("addExercise.metricsDistanceLabel")}
              value={distance}
              onChangeText={setDistance}
              placeholder={t("addExercise.metricsDistancePlaceholder")}
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
