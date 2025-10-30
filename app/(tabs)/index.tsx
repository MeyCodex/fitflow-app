import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { RoutineCard } from "@/src/components/RoutineCard";
import { Link } from "expo-router";
import { DAYS_OF_WEEK_ES } from "@/src/constants/date";
import { useTranslation } from "react-i18next";
import { Routine, RoutineSchedule } from "@/src/types/routine";

const sortRoutinesBySchedule = (a: Routine, b: Routine): number => {
  const scheduleOrder: Record<RoutineSchedule, number> = {
    morning: 1,
    afternoon: 2,
    evening: 3,
    any: 4,
  };
  return (scheduleOrder[a.schedule] ?? 4) - (scheduleOrder[b.schedule] ?? 4);
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const allRoutines = useRoutineStore((state) => state.routines);
  const today = new Date();
  const currentDayName = DAYS_OF_WEEK_ES[today.getDay()];
  const todayRoutines = allRoutines
    .filter((r) => r.days.includes(currentDayName))
    .sort(sortRoutinesBySchedule);

  const otherRoutines = allRoutines
    .filter((r) => !r.days.includes(currentDayName))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <FlatList
          data={otherRoutines}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/routine/[id]",
                params: { id: item.id },
              }}
              asChild
            >
              <RoutineCard
                name={item.name}
                // (Opcional) Podríamos añadir el horario o los días aquí si quisiéramos
                exercisesCount={item.exercises.length}
              />
            </Link>
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View className="mb-6">
              <View className="mb-6">
                <Text className="text-3xl font-bold text-text-dark">
                  {t("home.title")}
                </Text>
                <Text className="text-lg text-text-light">
                  {t("home.greeting")}
                </Text>
              </View>
              <Text className="text-xl font-bold text-primary mb-3">
                {t("home.today", { day: currentDayName })}
              </Text>
              {todayRoutines.length > 0 ? (
                todayRoutines.map((item) => (
                  <Link
                    key={item.id}
                    href={{
                      pathname: "/routine/[id]",
                      params: { id: item.id },
                    }}
                    asChild
                  >
                    <RoutineCard
                      name={item.name}
                      // (Opcional) Mostrar el schedule: name={`${item.name} (${t('scheduleSelector.'+item.schedule)})`}
                      exercisesCount={item.exercises.length}
                    />
                  </Link>
                ))
              ) : (
                <View className="bg-card p-4 rounded-lg items-center mb-4">
                  <Text className="text-text-light">
                    {t("home.noRoutineToday")}
                  </Text>
                </View>
              )}
              {otherRoutines.length > 0 && (
                <Text className="text-xl font-bold text-text-dark mt-6 mb-3">
                  {t("home.nextRoutines")}
                </Text>
              )}
            </View>
          )}
          ListEmptyComponent={() =>
            allRoutines.length === 0 ? (
              <View className="items-center justify-center p-10 mt-10">
                <Text className="text-lg text-text-light">
                  {t("home.noRoutinesCreated")}
                </Text>
                <Text className="text-lg text-text-light">
                  {t("home.pressAdd")}
                </Text>
              </View>
            ) : null
          }
          contentContainerClassName="p-6"
        />
      </SafeAreaView>
    </View>
  );
}
