import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/src/components/FormInput";
import { WeightUnit } from "@/src/types/routine";
import { PickerOption, StyledPicker } from "../StyledPicker";

type WeightInputProps = {
  label: string;
  value: string;
  unit: WeightUnit;
  onChangeText: (text: string) => void;
  onUnitChange: (unit: WeightUnit) => void;
};

export function WeightInput({
  label,
  value,
  unit,
  onChangeText,
  onUnitChange,
}: WeightInputProps) {
  const { t } = useTranslation();

  const unitOptions: PickerOption[] = [
    { label: t("metrics.units.kg"), value: "kg" },
    { label: t("metrics.units.lbs"), value: "lbs" },
    { label: t("metrics.units.bw"), value: "bw" },
  ];

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="flex-row items-center space-x-2">
        <View className="flex-2">
          <FormInput
            label=""
            value={value}
            onChangeText={onChangeText}
            placeholder={t("metrics.weightPlaceholder")}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <StyledPicker
            label=""
            selectedValue={unit}
            onValueChange={onUnitChange}
            options={unitOptions}
          />
        </View>
      </View>
    </View>
  );
}
