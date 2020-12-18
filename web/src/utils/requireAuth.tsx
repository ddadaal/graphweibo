import React from "react";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { NotAuthorized } from "src/components/errors/NotAuthorized";


export interface RequireAuthProps {
  userStore: ReturnType<typeof UserStore>;
}

export const requireAuth = () =>
  <CP extends {}>(Component: React.ComponentType<RequireAuthProps & CP>) => (cp) => {
    const userStore = useStore(UserStore);

    if (!userStore.loggedIn) {
      return <NotAuthorized />;
    }

    return <Component userStore={userStore} {...cp} />;
  };
