import React, { createContext, useContext } from "react";
import { notification } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

const NotificationApiContext = createContext<NotificationInstance | null>(null);

export function useNotificationApi(): NotificationInstance {
  const ctx = useContext(NotificationApiContext);
  if (!ctx) {
    throw new Error("useNotificationApi must be used within Notification");
  }
  return ctx;
}

export default function Notification({children}: {children: React.ReactNode}) {
  const [api, contextHolder] = notification.useNotification();
  return (
    <NotificationApiContext.Provider value={api} >
      {contextHolder}
      {children}
    </NotificationApiContext.Provider>
  );
}
