import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esTranslation from "./locales/es.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    es: {
      translation: esTranslation,
    },
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
