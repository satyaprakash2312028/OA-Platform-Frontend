import {create} from "zustand"
import DAISY_UI_CONSTANTS from "../constants/daisy_ui_contants";

const useThemeStore = create((set)=>({
    theme: localStorage.getItem("codephilia-theme")||DAISY_UI_CONSTANTS.DARK_THEME,
    setTheme: (theme) => {
        localStorage.setItem("codephilia-theme", theme);
        set({theme});
    },
}));
export default useThemeStore;