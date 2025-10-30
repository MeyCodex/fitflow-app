import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors from "tailwindcss/colors";

type RoutineCardProps = TouchableOpacityProps & {
  name: string;
  exercisesCount: number;
  className?: string;
  isCompleted?: boolean;
};

export function RoutineCard({
  name,
  exercisesCount,
  className,
  isCompleted,
  ...rest
}: RoutineCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className={`p-5 rounded-xl shadow-md active:opacity-70 ${className} ${
        isCompleted ? "bg-green-50 border border-green-300" : "bg-card"
      }`}
      {...rest}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-text-dark">{name}</Text>
          <Text className="text-base text-text-light">
            {t("routineCard.exercisesCount_other", { count: exercisesCount })}
          </Text>
          {isCompleted && (
            <Text className="text-base text-primary font-semibold mt-1">
              {t("routineCard.completed")}
            </Text>
          )}
        </View>
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isCompleted ? "bg-green-200" : "bg-primary"
          }`}
        >
          {isCompleted ? (
            <Feather name="check" size={24} color={colors.green[700]} />
          ) : (
            <Feather name="play" size={24} color="white" className="ml-1" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
