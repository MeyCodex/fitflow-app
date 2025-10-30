import { useTranslation } from "react-i18next";
import { ExerciseType } from "@/src/types/routine";
import { PickerOption, StyledPicker } from "./StyledPicker";

type ExerciseTypeSelectorProps = {
  label: string;
  selectedValue: ExerciseType;
  onValueChange: (value: ExerciseType) => void;
};

export function ExerciseTypeSelector({
  label,
  selectedValue,
  onValueChange,
}: ExerciseTypeSelectorProps) {
  const { t } = useTranslation();
  const typeOptions: PickerOption[] = [
    { label: t("exerciseTypeSelector.strength"), value: "strength" },
    { label: t("exerciseTypeSelector.cardio"), value: "cardio" },
    { label: t("exerciseTypeSelector.stretch"), value: "stretch" },
    { label: t("exerciseTypeSelector.other"), value: "other" },
  ];

  return (
    <StyledPicker
      label={label}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      options={typeOptions}
    />
  );
}
