import { View, Text, TextInput, TextInputProps } from "react-native";

type FormInputProps = TextInputProps & {
  label: string;
};

export function FormInput({ label, ...textInputProps }: FormInputProps) {
  return (
    <View>
      <Text className="text-base text-text-light mb-2">{label}</Text>
      <TextInput
        placeholderTextColor="#999"
        className="bg-card p-4 rounded-lg text-lg text-text-dark"
        {...textInputProps}
      />
    </View>
  );
}
