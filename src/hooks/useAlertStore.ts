import { create } from "zustand";

export interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress: () => void;
}

export interface AlertOptions {
  title: string;
  message: string;
  buttons: AlertButton[];
}

interface AlertState {
  isVisible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  alert: (options: AlertOptions) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isVisible: false,
  title: "",
  message: "",
  buttons: [],
  alert: (options) =>
    set({
      isVisible: true,
      title: options.title,
      message: options.message,
      buttons: options.buttons,
    }),

  hide: () =>
    set({
      isVisible: false,
      title: "",
      message: "",
      buttons: [],
    }),
}));
