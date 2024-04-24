import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const websocketStore = create(
  persist(
    (set) => ({
      notificationSocket: null,
      notificationArray: [], // Adicione um array para armazenar as contagens de notificações como objetos
      notificationArrayLength: 0,

      tasksWS: null,

      setNotificationSocket: (notificationSocket) =>
        set({ notificationSocket }),
      setNotificationArray: (notificationArray) => set({ notificationArray }),
      getNotificationArrayLength: () => {
        const { notificationArray } = websocketStore.getState(); // Obter a notificaçãoArray do estado websocketStore
        return notificationArray.length;
      },

      setTasksWS: (tasksWS) => set({ tasksWS }),
    }),
    {
      name: "websocket-storage",
      getStorage: createJSONStorage(),
    }
  )
);
