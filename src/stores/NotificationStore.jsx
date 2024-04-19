import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";

export const notificationStore = create((set) => ({
  notifications: [],
  updateNotifications: (notifications) => set({ notifications }),
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    })),
}));
