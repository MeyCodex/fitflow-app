import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const days = [
  { label: "Selecciona un día", value: "" },
  { label: "Lunes", value: "Lunes" },
  { label: "Martes", value: "Martes" },
  { label: "Miércoles", value: "Miércoles" },
  { label: "Jueves", value: "Jueves" },
  { label: "Viernes", value: "Viernes" },
  { label: "Sábado", value: "Sábado" },
  { label: "Domingo", value: "Domingo" },
];

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
          {days.map((day) => (
            <Picker.Item key={day.value} label={day.label} value={day.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
