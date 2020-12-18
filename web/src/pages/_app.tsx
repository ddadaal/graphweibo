import React from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { createI18nStore, loadLanguage } from "simstate-i18n";
import { cn, getCookieLanguage, i18nContext, Language } from "src/i18n";
import { createStore, StoreProvider } from "simstate";
import dynamic from "next/dynamic";
import withDarkMode from "next-dark-mode";
import useConstant from "src/utils/useConstant";
import { getCurrentUserInCookie, User, UserStore } from "src/stores/UserStore";
import { changeToken } from "src/apis/fetch";
import "nprogress/nprogress.css";
import "antd/dist/antd.css";
import { NotificationProvider } from "src/utils/NotificationHelper";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);


type Props = AppProps & {
  firstLanguage: Language;
  user: User | null;
}

function MyApp({ Component, pageProps, user, firstLanguage }: Props) {

  const userStore = useConstant(() => {
    const store = createStore(UserStore, user);
    if (user) {
      changeToken(user.token);
    }
    return store;
  });

  const i18nStore = useConstant(() => createI18nStore(i18nContext, firstLanguage));

  return (
    <StoreProvider stores={[i18nStore, userStore]}>
      <NotificationProvider>
        <TopProgressBar />
        <Component {...pageProps} />
      </NotificationProvider>
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
  return { ...appProps, firstLanguage };
};

export default withDarkMode(MyApp);
