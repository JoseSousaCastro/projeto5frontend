import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { userStore } from "./UserStore";

// Define a store
export const categoryStore = create(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => {
        console.log("Categorias armazenadas:", categories);
        set({ categories });
      },
      // Função para adicionar uma nova categoria
      addCategory: (category) => {
        console.log("Adicionando categoria:", category);
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },
      // Função para editar uma categoria existente
      editCategory: (oldCategory, updatedCategory) => {
        console.log("Editando categoria:", oldCategory, updatedCategory);
        set((state) => ({
          categories: state.categories.map((category) =>
            category === oldCategory ? updatedCategory : category
          ),
        }));
      },
      // Função para excluir uma categoria
      deleteCategory: (deleteCategory) => {
        console.log("Excluindo categoria:", deleteCategory);
        set((state) => ({
          categories: state.categories.filter(
            (category) => category !== deleteCategory
          ),
        }));
      },
      fetchCategories: async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/project5/rest/users/categories",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: userStore.getState().token,
              },
            }
          );
          if (response.ok) {
            const categories = await response.json();
            set({ categories: categories.map((category) => category.name) });
          } else {
            console.error("Failed to fetch categories:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
    }),
    {
      name: "categoryStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
