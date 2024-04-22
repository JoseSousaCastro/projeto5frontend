import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// define the store
export const userStore = create(
  persist(
    (set) => ({
      username: "",
      token: "",
      photoURL: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      users: null, // Inicializa users como null
      visible: false,
      typeOfUser: "",
      expirationTime: 0,
      confirmed: false,
      updateUsername: (username) => set({ username }),
      updateToken: (token) => set({ token }),
      updatePhotoURL: (photoURL) => set({ photoURL }),
      updateEmail: (email) => set({ email }),
      updateFirstName: (firstName) => set({ firstName }),
      updateLastName: (lastName) => set({ lastName }),
      updatePhone: (phone) => set({ phone }),
      updatePassword: (password) => set({ password }),
      updateUserTasks: (userTasks) => set({ userTasks }),
      updateVisible: (visible) => set({ visible }),
      updateTypeOfUser: (typeOfUser) => set({ typeOfUser }),
      updateUsers: (users) => set({ users }), // Adiciona a função updateUsers
      deleteAllUserTasks: () => set({ userTasks: [] }),
      updateExpirationTime: (expirationTime) => set({ expirationTime }),
      updateConfirmed: (confirmed) => set({ confirmed }),

      fetchUsers: async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/project5/rest/users/all",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: userStore.getState().token,
              },
            }
          );
          if (response.ok) {
            let users = await response.json();
            console.log("Usuários recebidos:", users);
            users = users.filter((user) => user.username !== "admin");
            console.log("Usuários filtrados:", users);
            set({ users }); // Atualiza os usuários no estado
          } else {
            console.error("Failed to fetch users:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
    }),
    {
      name: "mystore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
