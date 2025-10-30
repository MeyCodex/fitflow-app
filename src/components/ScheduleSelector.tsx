import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { RoutineSchedule } from "@/src/types/routine";

type ScheduleSelectorProps = {
  label: string;
  selectedValue: RoutineSchedule;
  onValueChange: (value: RoutineSchedule) => void;
};

const scheduleOptions: { labelKey: string; value: RoutineSchedule }[] = [
  { labelKey: "scheduleSelector.any", value: "any" },
  { labelKey: "scheduleSelector.morning", value: "morning" },
  { labelKey: "scheduleSelector.afternoon", value: "afternoon" },
  { labelKey: "scheduleSelector.evening", value: "evening" },
];

export function ScheduleSelector({
  label,
  selectedValue,
  onValueChange,
}: ScheduleSelectorProps) {
  const { t } = useTranslation();

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="bg-card rounded-lg text-lg overflow-hidden h-[60px] justify-center">
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) =>
            onValueChange(itemValue as RoutineSchedule)
          }
          style={{
            color: "#333333",
            backgroundColor: "transparent",
          }}
          dropdownIconColor="#333333"
        >
          {scheduleOptions.map((option) => (
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
