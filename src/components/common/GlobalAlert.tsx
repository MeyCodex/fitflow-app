import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import { useAlertStore, AlertButton } from "@/src/hooks/useAlertStore";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

const AlertModalButton = ({ button }: { button: AlertButton }) => {
  const hide = useAlertStore((state) => state.hide);

  const handlePress = () => {
    button.onPress();
    hide();
  };
  let textClass = "text-primary font-bold";
  if (button.style === "destructive") {
    textClass = "text-danger-dark font-bold";
  } else if (button.style === "cancel") {
    textClass = "text-text-light";
  }

  return (
    <TouchableOpacity onPress={handlePress} className="p-3 flex-1 items-center">
      <Text className={`text-lg ${textClass}`}>{button.text}</Text>
    </TouchableOpacity>
  );
};

export function GlobalAlert() {
  const { isVisible, title, message, buttons, hide } = useAlertStore();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={hide}
    >
      <Pressable
        onPress={hide}
        className="flex-1 justify-center items-center bg-black/50 p-6"
      >
        <Pressable className="bg-card w-full rounded-2xl shadow-lg max-w-sm">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <Feather
                name="alert-triangle"
                size={24}
                color={colors.red[500]}
              />
              <Text className="text-2xl font-bold text-text-dark ml-3">
                {title}
              </Text>
            </View>

            <Text className="text-lg text-text-light mb-6">{message}</Text>
          </View>
          <View className="flex-row border-t border-gray-200">
            {buttons.map((button, index) => (
              <View key={index} className="flex-1 flex-row">
                {index > 0 && <View className="w-px bg-gray-200" />}
                <AlertModalButton button={button} />
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
