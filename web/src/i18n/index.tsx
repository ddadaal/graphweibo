import cn from "./cn";

const en = () => import("./en").then((x) => x.default);

import { createI18nContext, I18nStore, I18nStoreDef } from "simstate-i18n";
import { useStore } from "simstate";
import { parseCookies, setCookie } from "nookies";

const i18nContext = createI18nContext(cn, { en });

const { getLanguage, idAccessor: lang } = i18nContext;

type Language = typeof cn;

const languageNames = {
  cn: "简体中文",
  en: "English",
};

export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}

export { i18nContext, getLanguage, lang, cn, languageNames };

export type { Language };

const LANG_STORAGE_KEY = "simstate-i18n-lang";
const COOKIE_PATH = "/";

type Ctx = Parameters<typeof parseCookies>[0];

export function getCookieLanguage(ctx?: Ctx): string {
  const cookie = parseCookies(ctx)[LANG_STORAGE_KEY];

  return cookie || "cn";
}

export function saveLanguageToCookie(language: string) {
  setCookie(null, LANG_STORAGE_KEY, language, {
    maxAge: 30 * 24 * 60 * 60,
    path: COOKIE_PATH,
  });
}
