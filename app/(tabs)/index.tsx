import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoutineStore } from "@/src/hooks/useRoutineStore";
import { RoutineCard } from "@/src/components/RoutineCard";
import { Link } from "expo-router";
import { DAYS_OF_WEEK_ES } from "@/src/constants/date";
import { useTranslation } from "react-i18next";
import { Routine, RoutineSchedule, WorkoutSession } from "@/src/types/routine";
import { useMemo } from "react";

const sortRoutinesBySchedule = (a: Routine, b: Routine): number => {
  const scheduleOrder: Record<RoutineSchedule, number> = {
    morning: 1,
    afternoon: 2,
    evening: 3,
    any: 4,
  };
  return (scheduleOrder[a.schedule] ?? 4) - (scheduleOrder[b.schedule] ?? 4);
};

const isRoutineCompletedToday = (
  routineId: string,
  sessions: WorkoutSession[]
): boolean => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  return sessions.some(
    (session) =>
      session.routineId === routineId &&
      new Date(session.completedAt).getTime() >= todayTimestamp
  );
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const allRoutines = useRoutineStore((state) => state.routines);
  const sessions = useRoutineStore((state) => state.sessions);
  const today = new Date();
  const todayIndex = today.getDay();
  const currentDayName = DAYS_OF_WEEK_ES[todayIndex];

  const todayRoutines = useMemo(
    () =>
      allRoutines
        .filter((r) => r.days.includes(currentDayName))
        .sort(sortRoutinesBySchedule),
    [allRoutines, currentDayName]
  );

  const upcomingDays = useMemo(() => {
    const upcoming = [];
    for (let i = 1; i <= 3; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = DAYS_OF_WEEK_ES[nextDayIndex];

      const routinesForDay = allRoutines
        .filter((r) => r.days.includes(nextDayName))
        .sort(sortRoutinesBySchedule);

      upcoming.push({
        dayName: nextDayName,
        routines: routinesForDay,
      });
    }
    return upcoming;
  }, [allRoutines, todayIndex]);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <FlatList
          data={[]}
          keyExtractor={(item: any) => item.id}
          renderItem={() => null}
          ListHeaderComponent={() => (
            <View>
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
                      exercisesCount={item.exercises.length}
                      isCompleted={isRoutineCompletedToday(item.id, sessions)}
                      className="mb-2"
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
              <Text className="text-xl font-bold text-text-dark mt-6 mb-3">
                {t("home.nextRoutines")}
              </Text>
              {upcomingDays.map((day) => (
                <View key={day.dayName} className="mb-4">
                  <Text className="text-lg font-semibold text-text-dark mb-2">
                    {day.dayName}
                  </Text>
                  {day.routines.length > 0 ? (
                    day.routines.map((item) => (
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
                          exercisesCount={item.exercises.length}
                          isCompleted={isRoutineCompletedToday(
                            item.id,
                            sessions
                          )}
                          className="mb-2"
                        />
                      </Link>
                    ))
                  ) : (
                    <View className="bg-card/60 p-4 rounded-lg items-center">
                      <Text className="text-text-light italic">
                        {t("home.restDay")}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center p-10 mt-10">
              <Text className="text-lg text-text-light">
                {t("home.noRoutinesCreated")}
              </Text>
              <Text className="text-lg text-text-light">
                {t("home.pressAdd")}
              </Text>
            </View>
          )}
          contentContainerClassName="p-6"
        />
      </SafeAreaView>
    </View>
  );
}
