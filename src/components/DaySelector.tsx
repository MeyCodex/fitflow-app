import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { DAYS_OF_WEEK_ES } from "@/src/constants/date";

type DaySelectorProps = {
  label: string;
  selectedDay: string;
  onSelectDay: (day: string) => void;
};

export function DaySelector({
  label,
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  const { t } = useTranslation();

  const pickerItems = [
    { label: t("daySelector.selectPlaceholder"), value: "" },
    ...DAYS_OF_WEEK_ES.slice(1).map((day) => ({ label: day, value: day })),
    { label: DAYS_OF_WEEK_ES[0], value: DAYS_OF_WEEK_ES[0] },
  ];

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="bg-card rounded-lg text-lg overflow-hidden h-[60px] justify-center">
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => onSelectDay(itemValue)}
          style={{
            color: "#333333",
            backgroundColor: "transparent",
          }}
          dropdownIconColor="#333333"
        >
          {pickerItems.map((day) => (
            <Picker.Item key={day.value} label={day.label} value={day.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
