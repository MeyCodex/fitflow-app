import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { useTranslation } from "react-i18next";

export type PickerOption = {
  label: string;
  value: string | number;
};

type StyledPickerProps = {
  label: string;
  selectedValue: string | number;
  onValueChange: (value: any) => void;
  options: PickerOption[];
  placeholder?: string;
};

export function StyledPicker({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
}: StyledPickerProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (option: PickerOption) => {
    onValueChange(option.value);
    setModalVisible(false);
  };

  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-card p-4 rounded-lg flex-row justify-between items-center h-[60px]"
      >
        <Text className="text-lg text-text-dark">{selectedLabel}</Text>
        <Feather name="chevron-down" size={22} color={colors.gray[400]} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 justify-center items-center bg-black/50 p-6"
        >
          <Pressable
            onPress={() => {}}
            className="bg-card w-full rounded-lg shadow-lg max-h-[50%]"
          >
            <SafeAreaView edges={["bottom"]}>
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    className="p-4 border-b border-gray-100"
                  >
                    <Text className="text-lg text-text-dark text-center">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="p-4 bg-gray-100 rounded-b-lg"
                  >
                    <Text className="text-lg text-primary font-bold text-center">
                      {t("common.cancel")}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
