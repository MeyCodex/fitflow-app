import { Alert } from "react-native";
import i18n from "@/src/i18n/config";

export function showConfirmationAlert(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmButtonText?: string,
  cancelButtonText?: string
) {
  const { t } = i18n;

  Alert.alert(title, message, [
    {
      text: cancelButtonText || t("routineDetail.cancelButton"),
      style: "cancel",
    },
    {
      text: confirmButtonText || t("routineDetail.deleteButton"),
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
}
