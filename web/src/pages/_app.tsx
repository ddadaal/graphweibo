import React from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import "normalize.css";
import { createI18nStore, loadLanguage } from "simstate-i18n";
import { cn, getCookieLanguage, i18nContext, Language } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { getCurrentUserInCookie, User, UserStore } from "src/stores/UserStore";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import withDarkMode from "next-dark-mode";
import { ThemeStore } from "src/stores/ThemeStore";
import useConstant from "src/utils/useConstant";
import { changeToken } from "src/apis/fetch";
import "react-toastify/dist/ReactToastify.css";
import { ScrollEventStore } from "src/stores/ScrollEventStore";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

const themeStore = createStore(ThemeStore);

type Props = AppProps & {
  user: User | null;
} & {
  firstLanguage: Language;
}

function MyApp({ Component, pageProps, user, firstLanguage }: Props) {

  const userStore = useConstant(() => {
    const store = createStore(UserStore, user);
    if (user) {
      changeToken(user?.token);
    }
    return store;
  });

  const i18nStore = useConstant(() => createI18nStore(i18nContext, firstLanguage));
  const scrollEventStore = useConstant(() => createStore(ScrollEventStore));

  return ( <StoreProvider stores={[i18nStore, userStore, themeStore, scrollEventStore]}>
    <MainLayout >
      <TopProgressBar />
      <Component {...pageProps} />
    </MainLayout>
  </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {

  const user = getCurrentUserInCookie(appContext.ctx);

  if (user) {
    changeToken(user.token);
  }

  const langId = getCookieLanguage(appContext.ctx);

  const language = i18nContext.getLanguage(langId);
  const firstLanguage = language ? await loadLanguage(language) : cn;

  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, user, firstLanguage };
};

export default withDarkMode(MyApp);
