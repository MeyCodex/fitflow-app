import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { ExerciseType } from "@/src/types/routine";

type ExerciseTypeSelectorProps = {
  label: string;
  selectedValue: ExerciseType;
  onValueChange: (value: ExerciseType) => void;
};

const typeOptions: { labelKey: string; value: ExerciseType }[] = [
  { labelKey: "exerciseTypeSelector.strength", value: "strength" },
  { labelKey: "exerciseTypeSelector.cardio", value: "cardio" },
  { labelKey: "exerciseTypeSelector.stretch", value: "stretch" },
  { labelKey: "exerciseTypeSelector.other", value: "other" },
];

export function ExerciseTypeSelector({
  label,
  selectedValue,
  onValueChange,
}: ExerciseTypeSelectorProps) {
  const { t } = useTranslation();

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="bg-card rounded-lg text-lg overflow-hidden h-[60px] justify-center">
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) =>
            onValueChange(itemValue as ExerciseType)
          }
          style={{
            color: "#333333",
            backgroundColor: "transparent",
          }}
          dropdownIconColor="#333333"
        >
          {typeOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={t(option.labelKey)}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
