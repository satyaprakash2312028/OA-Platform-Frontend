import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { subscribeToBroadcast, unSubscribeToBroadcast } from "../lib/socket.js";
const BASE_URL = "http://localhost:5000";
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
            if (get.problemId === "" || get.problemId === null) {
                toast.dismiss();
                toast.error("Please provide Problem ID");
                set({ isSubmitting: false });
                return;
            }
            axiosInstance.post(`problem/submitProblem/${get().problemId}`, {
                assessmentID: get().assessmentId,
                code: get().code,
                language: get().language
            }).then(res => {
                toast.loading(`${res.data.message}`, {
                    id: res.data.submissionId,
                    duration: 3000
                });
                subscribeToBroadcast();
            }).catch(err => {
                console.log(err);
                toast.dismiss();
                toast.error(err?.response?.data?.message || 'Failed to submit the code.');
            })

        } catch (error) {
            toast.dismiss();
            toast.error(err?.response?.data?.message || 'Failed to submit the code.');
        } finally {
            set({ isSubmitting: false });
            setTimeout(() => {
                set({ cooldown: false });
            }, 10000);
            
        }
    }
}));

export default editorStore;