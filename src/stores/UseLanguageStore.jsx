import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(persist(
  (set) => ({
    language: 'en', // idioma padrão
    setLanguage: (lang) => set({ language: lang }), // função para definir o idioma
  }),
  {
    name: 'language-storage', // nome da chave no armazenamento local
  }
));

export default useLanguageStore;
