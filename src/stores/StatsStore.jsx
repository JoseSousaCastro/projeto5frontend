import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { userStore } from "./UserStore";

// Define a store
export const statsStore = create(
  persist(
    (set) => ({
      // Define the store's state
      totalUsers: 0,
      totalConfirmedUsers: 0,
      totalUnconfirmedUsers: 0,
      usersOverTime: [],

      totalTasks: 0,
      totalToDoTasks: 0,
      totalDoingTasks: 0,
      totalDoneTasks: 0,
      tasksCompletedOverTime: [],

      tasksPerUser: 0,
      averageTaskTime: 0,

      categoriesListDesc: [],

      totalUserTasks: 0,
      totalUserToDoTasks: 0,
      totalUserDoingTasks: 0,
      totalUserDoneTasks: 0,

      // Define the store's actions
      updateTotalUsers: (totalUsers) => set({ totalUsers }),
      updateTotalConfirmedUsers: (totalConfirmedUsers) =>
        set({ totalConfirmedUsers }),
      updateTotalUnconfirmedUsers: (totalUnconfirmedUsers) =>
        set({ totalUnconfirmedUsers }),
      updateUsersOverTime: (usersOverTime) => set({ usersOverTime }),

      updateTotalTasks: (totalTasks) => set({ totalTasks }),
      updateTotalToDoTasks: (totalToDoTasks) => set({ totalToDoTasks }),
      updateTotalDoingTasks: (totalDoingTasks) => set({ totalDoingTasks }),
      updateTotalDoneTasks: (totalDoneTasks) => set({ totalDoneTasks }),
      updateTasksCompletedOverTime: (tasksCompletedOverTime) =>
        set({ tasksCompletedOverTime }),

      updateTasksPerUser: (tasksPerUser) => set({ tasksPerUser }),
      updateAverageTaskTime: (averageTaskTime) => set({ averageTaskTime }),

      updateCategoriesListDesc: (categoriesListDesc) =>
        set({ categoriesListDesc }),

      updateTotalUserTasks: (totalUserTasks) => set({ totalUserTasks }),
      updateTotalUserToDoTasks: (totalUserToDoTasks) =>
        set({ totalUserToDoTasks }),
      updateTotalUserDoingTasks: (totalUserDoingTasks) =>
        set({ totalUserDoingTasks }),
      updateTotalUserDoneTasks: (totalUserDoneTasks) =>
        set({ totalUserDoneTasks }),

      fetchGlobalStats: async () => {
        console.log("token", userStore.getState().token);
        try {
          const response = await fetch(
            "http://localhost:8080/project5/rest/users/stats",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: userStore.getState().token,
              },
            }
          );
          if (response.ok) {
            const stats = await response.json();
            console.log("Global stats received:", stats);
            set({
              totalUsers: stats.totalUsers,
              totalConfirmedUsers: stats.totalConfirmedUsers,
              totalUnconfirmedUsers: stats.totalUnconfirmedUsers,
              usersOverTime: stats.usersOverTime,

              totalTasks: stats.totalTasks,
              totalToDoTasks: stats.totalToDoTasks,
              totalDoingTasks: stats.totalDoingTasks,
              totalDoneTasks: stats.totalDoneTasks,
              tasksCompletedOverTime: stats.tasksCompletedOverTime,

              tasksPerUser: stats.tasksPerUser,
              averageTaskTime: stats.averageTaskTime,

              categoriesListDesc: stats.categoriesListDesc,
            });
          } else {
            console.error("Failed to fetch global stats:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching global stats:", error);
        }
      },

      fetchUserStats: async (username) => {
        console.log("token", userStore.getState().token);
        try {
          const response = await fetch(
            `http://localhost:8080/project5/rest/users/${username}/stats`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: userStore.getState().token,
              },
            }
          );
          if (response.ok) {
            const stats = await response.json();
            console.log("User stats received:", stats);
            set({
              totalUserTasks: stats.totalUserTasks,
              totalUserToDoTasks: stats.totalUserToDoTasks,
              totalUserDoingTasks: stats.totalUserDoingTasks,
              totalUserDoneTasks: stats.totalUserDoneTasks,
            });
          } else {
            console.error("Failed to fetch user stats:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      },
    }),

    {
      name: "stats-storage",
      getStorage: createJSONStorage(),
    }
  )
);
