import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { DurationMetrics } from "@/src/types/routine";
import colors from "tailwindcss/colors";

type DurationInputProps = {
  label: string;
  value: DurationMetrics;
  onChange: (value: DurationMetrics) => void;
};

export function DurationInput({ label, value, onChange }: DurationInputProps) {
  const { t } = useTranslation();
  const handleChange = (field: keyof DurationMetrics, text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    onChange({
      ...value,
      [field]: numericValue,
    });
  };

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="flex-row justify-between space-x-2">
        <View className="flex-1">
          <Text className="text-sm text-text-light mb-1">
            {t("metrics.hours")}
          </Text>
          <TextInput
            className="bg-card p-4 rounded-lg text-lg text-text-dark text-center h-[60px]"
            placeholderTextColor={colors.gray[400]}
            placeholder="0"
            value={value.hours}
            onChangeText={(text) => handleChange("hours", text)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-text-light mb-1">
            {t("metrics.minutes")}
          </Text>
          <TextInput
            className="bg-card p-4 rounded-lg text-lg text-text-dark text-center h-[60px]"
            placeholderTextColor={colors.gray[400]}
            placeholder="0"
            value={value.minutes}
            onChangeText={(text) => handleChange("minutes", text)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-text-light mb-1">
            {t("metrics.seconds")}
          </Text>
          <TextInput
            className="bg-card p-4 rounded-lg text-lg text-text-dark text-center h-[60px]"
            placeholderTextColor={colors.gray[400]}
            placeholder="0"
            value={value.seconds}
            onChangeText={(text) => handleChange("seconds", text)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>
    </View>
  );
}
