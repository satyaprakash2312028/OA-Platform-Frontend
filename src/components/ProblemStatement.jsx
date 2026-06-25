import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import useEditorStore from '../store/useEditorStore';

// 1. Hoist Markdown Plugins
// Prevents ReactMarkdown from tearing down and rebuilding its parser pipeline on every re-render
const REMARK_PLUGINS = [remarkMath];
const REHYPE_PLUGINS = [rehypeKatex];

// 2. Hoist Animation Configurations
// Prevents framer-motion from allocating new memory for these objects on every frame
const LOADER_ANIMATION = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: 0.6 }
};

const CONTAINER_ANIMATION = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4, type: "spring" }
};

const ProblemStatement = React.memo(() => {
    const { problemId } = useParams();
    const [statement, setStatement] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 3. Granular Zustand Selectors
    const setProblemId = useEditorStore((state) => state.setProblemId);
    const setAssessmentId = useEditorStore((state) => state.setAssessmentId);

    useEffect(() => {
        if (!problemId) {
            setProblemId(null);
            setAssessmentId(null);
            navigate(-1);
            toast.error("Problem ID not found");
            return;
        }

        // 4. Memory Leak & Race Condition Prevention
        let isMounted = true;

        const fetchProblem = async () => {
            try {
                const res = await axiosInstance.get(`/problem/getProblem/${problemId}`);
                
                // Only update state if the component is still mounted
                if (isMounted) {
                    setStatement(res.data);
                    setProblemId(problemId);
                    setAssessmentId(res.data.assessment ?? null);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    toast.dismiss();
                    toast.error(error?.response?.data?.message || "Error while fetching problem statement.");
                    navigate(-1);
                }
            }
        };

        fetchProblem();

        // Cleanup function runs when component unmounts or problemId changes
        return () => {
            isMounted = false;
        };
    }, [problemId, navigate, setProblemId, setAssessmentId]); 
    // Removed axiosInstance from dependencies as it's a static import, not a dynamic variable

    if (isLoading) {
        return (
            <AnimatePresence>
                <motion.div
                    key="problemStatement.loader"
                    {...LOADER_ANIMATION}
                    className="flex items-center justify-center h-screen overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    <span className="loading loading-infinity size-16"></span>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <motion.div
            {...CONTAINER_ANIMATION}
            className='w-full min-h-max h-full bg-base-100 p-5 pr-1 min-w-lg overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        >
            <div className="flex justify-center items-center h-fit w-full text-xl mb-5 font-semibold">
                <span>{statement.name}</span>
            </div>
            <div className="flex justify-center items-center h-fit w-full space-x-2 text-sm">
                <p><span>Time limit per test : <span className='font-semibold font-mono text-lg'>{statement.timeLimit}s</span></span></p>
            </div>
            <div className="flex justify-center items-center h-fit w-full space-x-2 text-sm mb-10">
                <p><span>Memory limit per test : <span className='font-semibold font-mono text-lg'>{statement.memoryLimit} MB</span></span></p>
            </div>
            <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={REMARK_PLUGINS}
                    rehypePlugins={REHYPE_PLUGINS}
                >
                    {statement.htmlDescription}
                </ReactMarkdown>
            </article>
        </motion.div>
    );
});

ProblemStatement.displayName = 'ProblemStatement';

export default ProblemStatement;