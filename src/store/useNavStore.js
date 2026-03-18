import {create} from 'zustand';

export const useNavStore = create((set) => ({
  navVisible: true,
  setNavVisibility: (visibility) => {set({ navVisible: visibility })}
}));
export default useNavStore;