import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-card"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View className="flex-1 flex-row relative">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const accessibilityLabel =
            options.tabBarAccessibilityLabel ??
            t(`tabs.${route.name}`, { defaultValue: route.name });
          const isFocused = state.index === index;

          if (route.name === "add-routine") {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={t("tabs.addRoutine")}
                onPress={() => {
                  router.push("/create-routine");
                }}
                className="w-16 h-16 bg-primary rounded-full justify-center items-center shadow-xl"
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  marginLeft: -32,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 8,
                }}
              >
                <Feather name="plus" size={32} color="white" />
              </TouchableOpacity>
            );
          }

          const iconName =
            route.name === "index" ? "sports-gymnastics" : "stacked-line-chart";
          const iconColor = isFocused ? colors.green[600] : colors.gray[400];

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={accessibilityLabel}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name={iconName as any}
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
