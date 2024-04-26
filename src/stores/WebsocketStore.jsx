import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const websocketStore = create(
  persist(
    (set) => ({
      notificationSocket: null,
      notificationArray: [],

      setNotificationSocket: (notificationSocket) => set({ notificationSocket }),
      setNotificationArray: (notificationArray) => set({ notificationArray }),

    }),
    {
      name: "websocket-storage",
      getStorage: createJSONStorage(),
    }
  )
);
