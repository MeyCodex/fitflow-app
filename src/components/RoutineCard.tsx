import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type RoutineCardProps = TouchableOpacityProps & {
  name: string;
  exercisesCount: number;
};

export function RoutineCard({
  name,
  exercisesCount,
  ...rest
}: RoutineCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className="bg-card p-5 rounded-xl shadow-md mb-4 active:opacity-70"
      {...rest}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-text-dark">{name}</Text>
          <Text className="text-base text-text-light">
            {t("routineCard.exercisesCount", { count: exercisesCount })}
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
          <Feather name="play" size={24} color="white" className="ml-1" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
