import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:5000";
const problemStore = create((set, get) => ({
    pageNumber: 0,
    isLoading: false,
    totalPages: 1,
    problems: [],
    failed: false,
    loadPage: async (pageNumber) => {
        set({ isLoading: true });
        try{
            console.log("Called")
            const res = await axiosInstance.get(`/problem/allProblems/page/${pageNumber}`);
            set({problems: res.data.problems});
            set({totalPages: res.data.totalPages});
            set({pageNumber: res.data.pageNumber});
            set({failed: false});
        }catch(error){
            set({failed: true});
            console.log("Error while loading the page.")
        }finally{
            set({ isLoading: false });
        }
    }
}));

export default problemStore;