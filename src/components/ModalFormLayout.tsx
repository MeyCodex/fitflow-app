import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

type ModalFormLayoutProps = {
  title: string;
  saveButtonText: string;
  onSave: () => void;
  children: ReactNode;
};

export function ModalFormLayout({
  title,
  saveButtonText,
  onSave,
  children,
}: ModalFormLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-text-dark">{title}</Text>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="x" size={28} color={colors.gray[800]} />
          </TouchableOpacity>
        </View>
        <View className="flex-1">{children}</View>
        <TouchableOpacity
          onPress={onSave}
          className="bg-primary p-4 rounded-full items-center justify-center mt-6"
        >
          <Text className="text-white text-lg font-bold">{saveButtonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
