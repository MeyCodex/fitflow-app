import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";

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

  if (!exercise) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">
            {t("editExercise.title")}
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="x" size={28} color="#333333" />
          </TouchableOpacity>
        </View>
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
            label={t("addExercise.videoLabel")}
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder={t("addExercise.videoPlaceholder")}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">
            {t("editExercise.saveButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
