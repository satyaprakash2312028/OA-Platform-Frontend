import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const MotionLink = motion.create(Link);

// 1. Hoist Animation Variants
// Prevents framer-motion from allocating new memory for inline animation objects on every frame.
const ROW_VARIANTS = {
    hidden: { scale: 0.8, opacity: 0, y: -50 },
    visible: (idx) => ({
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, type: "spring", delay: idx * 0.02 }
    }),
    exit: { opacity: 0 }
};

const EMPTY_STATE_VARIANTS = {
    hidden: { scale: 0, opacity: 0, y: -50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, type: "spring" } },
    exit: { scale: 0, opacity: 0, y: -50 }
};

const LOADER_VARIANTS = {
    hidden: { scale: 0.8, opacity: 0, y: -50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } },
    exit: { scale: 0, opacity: 0, y: -50 }
};

const SubmissionsPage = React.memo(() => {
    const { pageNumber } = useParams();
    const [submissions, setSubmissions] = useState([]);
    
    // Initialize as numbers to prevent repeated casting during render
    const [receivedPageNumber, setReceivedPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // 2. AbortController Integration
    useEffect(() => {
        const controller = new AbortController();
        
        setLoading(true);

        axiosInstance.get(`/problem/submissions/page/${pageNumber}`, {
            signal: controller.signal
        })
        .then(res => {
            setSubmissions(res.data.submissions);
            setReceivedPageNumber(Number(res.data.pageNumber));
            setTotalPages(Number(res.data.totalPages));
        })
        .catch(err => {
            // Ignore state updates if the request was intentionally aborted
            if (err.name === 'CanceledError') return;
            setSubmissions([]);
        })
        .finally(() => {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        });

        // Cleanup function cancels the pending request if the user navigates away
        // or clicks "Next Page" rapidly.
        return () => controller.abort();
    }, [pageNumber]); // Removed static axiosInstance from dependencies

    // 3. Pre-compute Pagination States
    const isFirstPage = receivedPageNumber <= 1;
    const isLastPage = receivedPageNumber >= totalPages;

    const handlePrevClick = useCallback((e) => {
        if (isFirstPage) e.preventDefault();
        else setLoading(true);
    }, [isFirstPage]);

    const handleNextClick = useCallback((e) => {
        if (isLastPage) e.preventDefault();
        else setLoading(true);
    }, [isLastPage]);

    return (
        <>
            <div className='mt-24 flex justify-between items-center px-1 mb-4 bg-base-200 mx-4 rounded-lg py-3'>
                <div className='w-fit px-4'>
                    <span className='font-semibold text-lg'>All Submissions</span>
                </div>
                <div className='space-x-2 mr-1'>
                    <div className="join space-x-2 scale-[102%]">
                        <MotionLink
                            to={(isFirstPage || loading) ? undefined : `/dashboard/submissions/page/${receivedPageNumber - 1}`}
                            onClick={handlePrevClick}
                            className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${isFirstPage ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeftIcon size={18} />
                        </MotionLink>
                        
                        <motion.span layout className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">
                            <AnimatePresence mode='popLayout'>
                                {loading ? (
                                    <motion.span
                                        key='span_pageNumber_loader'
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2, type: 'tween' }}
                                        className='loading loading-spinner size-6 text-base-100/75'
                                    />
                                ) : (
                                    <motion.span 
                                        key='span_pageNumber_finished' 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        transition={{ duration: 0.2, type: 'tween' }}
                                    >
                                        {receivedPageNumber}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.span>

                        <MotionLink
                            to={(isLastPage || loading) ? undefined : `/dashboard/submissions/page/${receivedPageNumber + 1}`}
                            onClick={handleNextClick}
                            className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${isLastPage ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronRightIcon size={18} />
                        </MotionLink>
                    </div>
                </div>
            </div>

            <motion.div layout className='w-full bg-base-100/25 backdrop-blur-xs rounded-lg px-16'>
                <table className='min-w-max w-full table-fixed'>
                    <thead className='font-bold'>
                        <tr className='border-b border-base-300'>
                            <th className='p-3 font-semibold'>Submission ID</th>
                            <th className='p-3 font-semibold'>Status</th>
                            <th className='p-3 font-semibold hidden sm:table-cell'>Time(ms)</th>
                            <th className='p-3 font-semibold hidden sm:table-cell'>Memory(KB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode='wait'>
                            {submissions.map((submission, idx) => (
                                <motion.tr
                                    key={submission._id}
                                    layout
                                    custom={idx}
                                    variants={ROW_VARIANTS}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={`${idx === submissions.length - 1 ? '' : ' border-b'} border-base-300 hover:bg-base-200 transition-colors duration-300`}
                                >
                                    <td className='text-info brightness-85 text-center p-5 font-mono sm:whitespace-nowrap sm:overflow-hidden truncate '>
                                        <Link to={`/submission/${submission._id}`} className='hover:underline'>{submission._id}</Link>
                                    </td>
                                    <td className={`text-center p-5 font-mono sm:whitespace-nowrap sm:overflow-hidden truncate ${submission.status === 'Accepted' ? 'text-success' : 'text-error'}`}>
                                        {submission.status}
                                    </td>
                                    <td className='text-center p-5 font-mono hidden sm:table-cell sm:whitespace-nowrap sm:overflow-hidden truncate '>
                                        {submission.executionTime ?? '-'}
                                    </td>
                                    <td className='text-center p-5 font-mono hidden sm:table-cell sm:whitespace-nowrap sm:overflow-hidden truncate '>
                                        {submission.memoryUsed ?? '-'}
                                    </td>
                                </motion.tr>
                            ))}

                            {submissions.length === 0 && !loading && (
                                <motion.tr
                                    key="no-submission-found"
                                    layout
                                    variants={EMPTY_STATE_VARIANTS}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No recent submissions
                                    </td>
                                </motion.tr>
                            )}

                            {submissions.length === 0 && loading && (
                                <motion.tr
                                    key="loading-submissions"
                                    layout
                                    variants={LOADER_VARIANTS}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <td colSpan="4" className='text-center'>
                                        <span className="loading loading-dots loading-md size-7 text-base-200 pt-10"></span>
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>
        </>
    );
});

SubmissionsPage.displayName = 'SubmissionsPage';

export default SubmissionsPage;