import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { userStore } from "./UserStore";
import { categoryStore } from "./CategoryStore";

export const taskStore = create(
    persist(
        (set) => ({
            id: null,
            title: "",
            description: "",
            stateId: 0,
            priority: 0,
            startDate: null,
            limitDate: null,
            category: "",
            erased: false,
            owner: { id: null, name: "" },

            updateId: (id) => set({ id }),
            updateTitle: (title) => set({ title }),
            updateDescription: (description) => set({ description }),
            updateStateId: (stateId) => set({ stateId }),
            updatePriority: (priority) => set({ priority }),
            updateStartDate: (startDate) => set({ startDate }),
            updateLimitDate: (limitDate) => set({ limitDate }),
            updateCategory: (category) => set({ category }), // Atualiza apenas o atributo category
            updateErased: (erased) => set({ erased }),

            tasks: [],
            setTasks: (tasks) => {
                console.log("Tarefas armazenadas:", tasks);
                set({ tasks });
            },

            fetchTasks: async () => {
                try {
                    const response = await fetch("http://localhost:8080/project_backend/rest/users/tasks", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            token: userStore.getState().token,
                        },
                    });
                    if (response.ok) {
                        const tasks = await response.json();
                        console.log("Tarefas recebidas:", tasks);
                        set({ tasks });
                        console.log("Tarefas armazenadas no fetch:", tasks);
                    } else {
                        console.error("Failed to fetch tasks:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            }
        }),
        {
            name: "taskStore",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
