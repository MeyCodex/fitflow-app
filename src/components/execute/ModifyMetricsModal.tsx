import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import {
  ExerciseMetrics,
  ExerciseType,
  WeightUnit,
  DurationMetrics,
} from "@/src/types/routine";
import { FormInput } from "@/src/components/FormInput";
import { WeightInput } from "@/src/components/form/WeightInput";
import { DurationInput } from "@/src/components/form/DurationInput";

type ModifyMetricsModalProps = {
  visible: boolean;
  onClose: () => void;
  plannedMetrics: ExerciseMetrics;
  exerciseType: ExerciseType;
  onSubmit: (actualMetrics: ExerciseMetrics) => void;
  t: (key: string) => string;
};

const initialDuration = { hours: "", minutes: "", seconds: "" };

export function ModifyMetricsModal({
  visible,
  onClose,
  plannedMetrics,
  exerciseType,
  onSubmit,
  t,
}: ModifyMetricsModalProps) {
  const [actualSets, setActualSets] = useState(
    String(plannedMetrics?.sets || "")
  );
  const [actualReps, setActualReps] = useState(
    String(plannedMetrics?.reps || "")
  );
  const [actualWeight, setActualWeight] = useState(
    String(plannedMetrics?.weight || "")
  );
  const [actualWeightUnit, setActualWeightUnit] = useState<WeightUnit>(
    plannedMetrics?.weightUnit || "kg"
  );
  const [actualDuration, setActualDuration] = useState<DurationMetrics>(
    plannedMetrics?.duration || initialDuration
  );
  const [actualDistance, setActualDistance] = useState(
    String(plannedMetrics?.distance || "")
  );
  useEffect(() => {
    if (visible) {
      setActualSets(String(plannedMetrics?.sets || ""));
      setActualReps(String(plannedMetrics?.reps || ""));
      setActualWeight(String(plannedMetrics?.weight || ""));
      setActualWeightUnit(plannedMetrics?.weightUnit || "kg");
      setActualDuration(plannedMetrics?.duration || initialDuration);
      setActualDistance(String(plannedMetrics?.distance || ""));
    }
  }, [visible, plannedMetrics]);
  const handleSubmit = () => {
    const actualMetrics: ExerciseMetrics = {};
    const { hours, minutes, seconds } = actualDuration;
    const durationIsSet = !!(hours || minutes || seconds);
    if (durationIsSet) {
      actualMetrics.duration = actualDuration;
    }
    if (actualSets) actualMetrics.sets = actualSets;
    if (actualReps) actualMetrics.reps = actualReps;
    if (actualWeight) {
      actualMetrics.weight = actualWeight;
      actualMetrics.weightUnit = actualWeightUnit;
    }
    if (actualDistance)
      actualMetrics.distance = parseInt(actualDistance, 10) || undefined;
    const plannedDurationIsSet = !!(
      plannedMetrics.duration &&
      (plannedMetrics.duration.hours ||
        plannedMetrics.duration.minutes ||
        plannedMetrics.duration.seconds)
    );

    const plannedForType =
      (exerciseType === "strength" &&
        (plannedMetrics.sets ||
          plannedMetrics.reps ||
          plannedMetrics.weight)) ||
      (exerciseType === "cardio" &&
        (plannedDurationIsSet || plannedMetrics.distance)) ||
      (exerciseType === "stretch" && plannedDurationIsSet);

    const actualForType =
      (exerciseType === "strength" &&
        (actualSets || actualReps || actualWeight)) ||
      (exerciseType === "cardio" && (durationIsSet || actualDistance)) ||
      (exerciseType === "stretch" && durationIsSet);

    if (plannedForType && !actualForType) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    onSubmit(actualForType ? actualMetrics : plannedMetrics);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card w-11/12 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-text-dark mb-4">
            {t("execute.confirmPerformanceTitle")}
          </Text>
          <ScrollView>
            {(exerciseType === "strength" || exerciseType === "other") && (
              <>
                <FormInput
                  label={t("metrics.sets")}
                  value={actualSets}
                  onChangeText={setActualSets}
                  keyboardType="numeric"
                  placeholder={t("metrics.setsPlaceholder")}
                />
                <View className="h-4" />
                <FormInput
                  label={t("metrics.reps")}
                  value={actualReps}
                  onChangeText={setActualReps}
                  placeholder={t("metrics.repsPlaceholder")}
                />
                <View className="h-4" />
                <WeightInput
                  label={t("metrics.weight")}
                  value={actualWeight}
                  unit={actualWeightUnit}
                  onChangeText={setActualWeight}
                  onUnitChange={setActualWeightUnit}
                />
                <View className="h-4" />
              </>
            )}

            {(exerciseType === "cardio" ||
              exerciseType === "stretch" ||
              exerciseType === "other") && (
              <>
                <DurationInput
                  label={t("metrics.duration")}
                  value={actualDuration}
                  onChange={setActualDuration}
                />
                <View className="h-4" />
              </>
            )}

            {(exerciseType === "cardio" || exerciseType === "other") && (
              <>
                <FormInput
                  label={t("metrics.distance")}
                  value={actualDistance}
                  onChangeText={setActualDistance}
                  keyboardType="numeric"
                  placeholder={t("metrics.distancePlaceholder")}
                />
                <View className="h-4" />
              </>
            )}
          </ScrollView>

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 p-3 rounded-lg flex-1 mr-2 items-center"
            >
              <Text className="text-text-dark font-bold">
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary p-3 rounded-lg flex-1 ml-2 items-center"
            >
              <Text className="text-white font-bold">{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
