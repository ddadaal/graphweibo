import { notification } from "antd";
import { NotificationInstance } from "antd/lib/notification";
import React from "react";

const NotificationContext =
  React.createContext<NotificationInstance | undefined>(undefined);

export const NotificationProvider: React.FC = ({ children }) => {
  const [notifyApi, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={notifyApi}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  return React.useContext(NotificationContext)!;
}
