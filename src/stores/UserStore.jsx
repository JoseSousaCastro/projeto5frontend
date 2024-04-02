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

            fetchUsers: async () => {
                try {
                    const response = await fetch("http://localhost:8080/project_backend/rest/users/all", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            token: userStore.getState().token,
                        },
                    });
                    if (response.ok) {
                        const users = await response.json();
                        console.log("Usuários recebidos:", users);
                        set({ users }); // Atualiza os usuários no estado
                    } else {
                        console.error("Failed to fetch users:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            }
        }),
        {
            name: "mystore",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
