import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { ExerciseMetrics, ExerciseType } from "@/src/types/routine";
import { FormInput } from "@/src/components/FormInput";

type ModifyMetricsModalProps = {
  visible: boolean;
  onClose: () => void;
  plannedMetrics: ExerciseMetrics;
  exerciseType: ExerciseType;
  onSubmit: (actualMetrics: ExerciseMetrics) => void;
  t: (key: string) => string;
};

export function ModifyMetricsModal({
  visible,
  onClose,
  plannedMetrics,
  exerciseType,
  onSubmit,
  t,
}: ModifyMetricsModalProps) {
  // El estado se inicializa con el valor planeado, o un string vacío si no existe
  const [actualSets, setActualSets] = useState(
    String(plannedMetrics?.sets || "")
  );
  const [actualReps, setActualReps] = useState(
    String(plannedMetrics?.reps || "")
  );
  const [actualWeight, setActualWeight] = useState(
    String(plannedMetrics?.weight || "")
  );
  const [actualDuration, setActualDuration] = useState(
    String(plannedMetrics?.duration || "")
  );
  const [actualDistance, setActualDistance] = useState(
    String(plannedMetrics?.distance || "")
  );

  const handleSubmit = () => {
    const actualMetrics: ExerciseMetrics = {};
    if (actualSets) actualMetrics.sets = actualSets;
    if (actualReps) actualMetrics.reps = actualReps;
    if (actualWeight) actualMetrics.weight = actualWeight;
    if (actualDuration)
      actualMetrics.duration = parseInt(actualDuration, 10) || undefined;
    if (actualDistance)
      actualMetrics.distance = parseInt(actualDistance, 10) || undefined;

    // --- LÓGICA DE VALIDACIÓN MEJORADA ---
    // Si el usuario no ingresa nada (todos los campos relevantes están vacíos),
    // asumimos que completó lo planeado.
    const plannedForType =
      (exerciseType === "strength" &&
        (plannedMetrics.sets ||
          plannedMetrics.reps ||
          plannedMetrics.weight)) ||
      (exerciseType === "cardio" &&
        (plannedMetrics.duration || plannedMetrics.distance)) ||
      (exerciseType === "stretch" && plannedMetrics.duration);

    const actualForType =
      (exerciseType === "strength" &&
        (actualSets || actualReps || actualWeight)) ||
      (exerciseType === "cardio" && (actualDuration || actualDistance)) ||
      (exerciseType === "stretch" && actualDuration);

    if (plannedForType && !actualForType) {
      alert(t("addExercise.fieldsRequiredError"));
      return;
    }
    onSubmit(actualForType ? actualMetrics : plannedMetrics);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setActualSets(String(plannedMetrics?.sets || ""));
      setActualReps(String(plannedMetrics?.reps || ""));
      setActualWeight(String(plannedMetrics?.weight || ""));
      setActualDuration(String(plannedMetrics?.duration || ""));
      setActualDistance(String(plannedMetrics?.distance || ""));
    }
  }, [visible, plannedMetrics]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card w-11/12 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-text-dark mb-4">
            {t("execute.confirmPerformanceTitle")} {/* <-- TÍTULO CAMBIADO */}
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
                <FormInput
                  label={t("metrics.weight")}
                  value={actualWeight}
                  onChangeText={setActualWeight}
                  placeholder={t("metrics.weightPlaceholder")}
                />
                <View className="h-4" />
              </>
            )}
            {(exerciseType === "cardio" || exerciseType === "other") && (
              <>
                <FormInput
                  label={t("metrics.duration")}
                  value={actualDuration}
                  onChangeText={setActualDuration}
                  keyboardType="numeric"
                  placeholder={t("metrics.durationPlaceholder")}
                />
                <View className="h-4" />
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
            {exerciseType === "stretch" && (
              <FormInput
                label={t("metrics.duration")}
                value={actualDuration}
                onChangeText={setActualDuration}
                keyboardType="numeric"
                placeholder={t("metrics.durationPlaceholder")}
              />
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
