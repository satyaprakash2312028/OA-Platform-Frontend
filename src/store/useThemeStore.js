import {create} from "zustand"

const useThemeStore = create((set)=>({
    theme: localStorage.getItem("codephilia-theme")||"cupcake",
    setTheme: (theme) => {
        localStorage.setItem("codephilia-theme", theme);
        set({theme});
    },
}));
export default useThemeStore;