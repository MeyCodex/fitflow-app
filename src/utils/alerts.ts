import i18n from "@/src/i18n/config";
import { useAlertStore } from "@/src/hooks/useAlertStore";

export function showConfirmationAlert(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmButtonText?: string,
  cancelButtonText?: string
) {
  const { t } = i18n;
  useAlertStore.getState().alert({
    title: title,
    message: message,
    buttons: [
      {
        text: cancelButtonText || t("common.cancel"),
        style: "cancel",
        onPress: () => {},
      },
      {
        text: confirmButtonText || t("common.delete"),
        style: "destructive",
        onPress: onConfirm,
      },
    ],
  });
}
