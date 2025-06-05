import { create } from "zustand";

export const useThemeStore = create((set) => {
  // Initialize theme here so it always reads fresh from localStorage
  const storedTheme = localStorage.getItem("chat-theme") || "coffee";

  return {
    theme: storedTheme,
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      set({ theme });
    },
  };
});
