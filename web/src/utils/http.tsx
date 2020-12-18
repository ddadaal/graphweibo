import { NotificationInstance } from "antd/lib/notification";
import Router from "next/router";
import React from "react";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";
import { useNotification } from "./NotificationHelper";

const root = lang.components.httpHandler;


export async function handleTokenInvalid(
  userStore: ReturnType<typeof UserStore>,
  notifyApi: NotificationInstance,
) {
  notifyApi.error({
    message: <LocalizedString id={root.tokenInvalid.title} /> ,
    description: <LocalizedString id={root.tokenInvalid.description} />,
  });

  await Router.push("/login");
  userStore.logout();
}

export function useInvalidTokenHandler() {
  const userStore = useStore(UserStore);
  const notifyApi = useNotification();

  return () => handleTokenInvalid(userStore, notifyApi);
}

export function handleHttpError(
  e: HttpError,
  userStore: ReturnType<typeof UserStore>,
  notifyApi: NotificationInstance,
) {
  if (process.env.NODE_ENV === "development") {
    console.log(e);
  }
  if (e.status === -1) {
    notifyApi.error({
      message: <LocalizedString id={root.networkError.title} />,
      description: <LocalizedString id={root.networkError.description} />,
    });

  } else if (e.status === 401) {
    // Route back to login page and show a notification.
    handleTokenInvalid(userStore, notifyApi);
  } else {
    notifyApi.error({
      message: <LocalizedString id={root.serverError.title} />,
      description: <LocalizedString id={root.serverError.description} />,
    });
  }
}

export function useHttpErrorHandler() {
  const userStore = useStore(UserStore);
  const notifyApi = useNotification();

  return (e: Error) => handleHttpError(e as any as HttpError, userStore, notifyApi);
}


export function useHttpRequest(
  setLoadingState: (b: boolean) => void,
) {
  const userStore = useStore(UserStore);
  const notifyApi = useNotification();

  return async (call: (args: {
    userStore: ReturnType<typeof UserStore>,
  }) => Promise<void>) => {
    try {
      setLoadingState(true);
      return await call({ userStore });
    } catch (e) {
      handleHttpError(e, userStore, notifyApi);
    } finally {
      setLoadingState(false);
    }
  };

}
