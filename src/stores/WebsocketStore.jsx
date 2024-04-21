import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const websocketStore = create(
  persist(
    (set, get) => ({
      chatSocket: null,
      notificationSocket: null,
      setChatSocket: (chatSocket) => set({ chatSocket }),
      setNotificationSocket: (notificationSocket) => set({ notificationSocket }),

      openChatSocket: (token, receiver) => {
        const chatSocket = new WebSocket(
          `ws://localhost:8080/project5/websocket/chat/${token}/${receiver}`
        );
        chatSocket.onopen = () => {
          console.log("Chat socket opened");
          set({ chatSocket });
        };
      },
      closeChatSocket: () => {
        const { chatSocket } = get();
        if (chatSocket) {
          chatSocket.close();
          set({ chatSocket: null });
        }
      },
      openNotificationSocket: (token) => {
        const notificationSocket = new WebSocket(
          `ws://localhost:8080/project5/websocket/notifications/${token}`
        );
        notificationSocket.onopen = () => {
          console.log("Notification socket opened");
          set({ notificationSocket });
        };
      },
    }),
    {
      name: "websocket-storage",
      getStorage: createJSONStorage(),
    }
  )
);
