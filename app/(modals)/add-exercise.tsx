import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { FormInput } from "@/src/components/FormInput";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { useTranslation } from "react-i18next";

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">
            {t("addExercise.title")}
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
            label={t("addExercise.videoUrlLabel")}
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder={t("addExercise.videoUrlPlaceholder")}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-auto"
        >
          <Text className="text-white text-lg font-bold">
            {t("addExercise.saveButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
