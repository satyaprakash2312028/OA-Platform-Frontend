import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { subscribeToBroadcast, unSubscribeToBroadcast } from "../lib/socket.js";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const editorStore = create((set, get) => ({
    problemId: null,
    code: "#include <iostream>\n\nint main() {\n\tstd::cout << \"Hello World\";\n\treturn 0;\n}",
    language: "cpp",
    isSubmitting: false,
    assessmentId: '',
    cooldown: false,
    setCode: (newCode) => {
        set({ code: newCode })
    },
    setProblemId: (newProblemId) => {
        set({ problemId: newProblemId });
    },
    setLanguage: (newLanguage) => {
        set({ language: newLanguage });
    },
    setAssessmentId: (newAssessmentId) => {
        set({ assessmentId: newAssessmentId });
    },
    submitProblem: async () => {
        set({ isSubmitting: true });
        set({cooldown: true});
        try {
            if (get().problemId === "" || get().problemId === null) {
                toast.dismiss();
                toast.error("Please provide Problem ID");
                set({ isSubmitting: false });
                return;
            }
            const res = await axiosInstance.post(`/problem/submitProblem/${get().problemId}`, {
                assessmentID: get().assessmentId,
                code: get().code,
                language: get().language
            });
            console.log(res);
            toast.loading(`Processing Submission: ${res.data._id}`, {
                id: res.data._id,
                duration: 3000
            });
            subscribeToBroadcast();

        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || 'Failed to submit the code.');
        } finally {
            set({ isSubmitting: false });
            setTimeout(() => {
                set({ cooldown: false });
            }, 10000);
            
        }
    }
}));

export default editorStore;