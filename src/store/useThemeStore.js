import {create} from "zustand"

const useThemeStore = create((set)=>({
    theme: "dark",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({theme});
    },
}));
export default useThemeStore;