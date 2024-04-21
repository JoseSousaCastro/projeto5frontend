import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const websocketStore = create(
  persist(
    (set) => ({
      notificationSocket: null,
      setNotificationSocket: (notificationSocket) => set({ notificationSocket }),
    }),
    {
      name: "websocket-storage",
      getStorage: createJSONStorage(),
    }
  )
);
