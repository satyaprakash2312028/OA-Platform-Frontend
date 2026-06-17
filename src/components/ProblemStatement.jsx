import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import useEditorStore from '../store/useEditorStore';
const ProblemStatement = () => {
    const { problemId } = useParams();
    const [statement, setStatement] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { setProblemId, setAssessmentId } = useEditorStore();
    useEffect(() => {
        console.log("Loadind rn :", isLoading);
        if (!problemId) {
            setProblemId(null);
            setAssessmentId(null)
            navigate(-1);
            toast.error("Problem ID not found");
        } else {
            try{
            axiosInstance.get(`/problem/getProblem/${problemId}`)
                .then(res => {
                    setStatement(res.data);
                    setProblemId(problemId);
                    setAssessmentId(res.data.assessment??null);
                    setIsLoading(false);
                    // console.log("Assessment ID in ProblemDetailPage:", assessmentId);
                })
                .catch(err => { toast.dismiss(); toast.error(err?.response?.data?.message || "No such problem found"); navigate(-1); });
            }catch(error){
                toast.dismiss();
                toast.error(error?.response?.data?.message || "Error while fetching problem statement.");
                navigate(-1);
            }
        }

    }, [problemId, navigate, axiosInstance]);
    if (isLoading){
        return (
            <AnimatePresence>
                <motion.div
                    key="problemStatement.loader"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center h-screen overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <span className="loading loading-infinity size-16"></span>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (

        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1}}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring" }}
        className='w-full min-h-max h-full bg-base-100 p-5 pr-1 min-w-lg overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        >
            <div className="flex justify-center items-center h-fit w-full text-xl mb-5 font-semibold"><span>{statement.name}</span></div>
            <div className="flex justify-center items-center h-fit w-full space-x-2 text-sm">
                <p><span>Time limit per test : <span className='font-semibold font-mono text-lg'>{statement.timeLimit}s</span></span></p>
            </div>
            <div className="flex justify-center items-center h-fit w-full space-x-2 text-sm mb-10">
                <p><span>Memory limit per test : <span className='font-semibold font-mono text-lg'>{statement.memoryLimit} MB</span></span></p>
            </div>
            <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                     {statement.htmlDescription}
                </ReactMarkdown>
            </article>
        </motion.div>
    )
}

export default ProblemStatement