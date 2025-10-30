import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DAYS_OF_WEEK_ES, DAYS_OF_WEEK_SHORT_ES } from "@/src/constants/date";

type MultiDaySelectorProps = {
  label: string;
  selectedDays: string[];
  onSelectionChange: (selectedDays: string[]) => void;
};
const displayIndices = [1, 2, 3, 4, 5, 6, 0];

export function MultiDaySelector({
  label,
  selectedDays,
  onSelectionChange,
}: MultiDaySelectorProps) {
  const handleDayPress = (longDayName: string) => {
    const isSelected = selectedDays.includes(longDayName);
    const newSelectedDays = isSelected
      ? selectedDays.filter((day) => day !== longDayName)
      : [...selectedDays, longDayName];
    onSelectionChange(newSelectedDays);
  };

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <View className="flex-row justify-between items-center flex-wrap">
        {displayIndices.map((dayIndex) => {
          const longDayName = DAYS_OF_WEEK_ES[dayIndex];
          const shortDayName = DAYS_OF_WEEK_SHORT_ES[dayIndex];
          const isSelected = selectedDays.includes(longDayName);

          return (
            <TouchableOpacity
              key={longDayName}
              onPress={() => handleDayPress(longDayName)}
              className={`
                py-2 px-3 rounded-full border border-gray-300 items-center mb-2
                ${isSelected ? "bg-primary border-primary" : "bg-card"}
              `}
            >
              <Text
                className={`
                  font-medium
                  ${isSelected ? "text-white" : "text-text-dark"}
                `}
              >
                {shortDayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
