import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import useAuthStore from '../../store/useAuthStore';
import { parseDateVector } from '../../lib/utility.js';

// 1. Hoist Animation Variants
const ROW_VARIANTS = {
  hidden: { scale: 0, opacity: 0, y: -50 },
  visible: (idx) => ({ scale: 1, opacity: 1, y: 0, transition: { duration: 0.7, type: "spring", delay: idx * 0.02 } }),
  exit: { opacity: 0 }
};

const EMPTY_VARIANTS = {
  hidden: { scale: 0, opacity: 0, y: -50 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, type: "spring" } },
  exit: { scale: 0, opacity: 0, y: -50 }
};

const LOADER_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0, y: -50 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } },
  exit: { scale: 0, opacity: 0, y: -50 }
};

const Dashboard = React.memo(() => {
  // Granular Subscriptions
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  
  const [problemSolved, setProblemSolved] = useState(0);
  const [contestGiven, setContestGiven] = useState(0);
  const [memberSince, setMemberSince] = useState([0, 0, 0]);
  const [lastAcceptedSubmission, setLastAcceptedSubmission] = useState([0, 0, 0]);
  const [recentSubmission, setRecentSubmission] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. Batch Async Requests with AbortController
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    Promise.all([
      axiosInstance.get('/dashboard/problemSolved', { signal }),
      axiosInstance.get('/dashboard/totalContestCount', { signal }),
      axiosInstance.get('/dashboard/recentSubmissions', { signal }),
      axiosInstance.get('/dashboard/lastAcceptedSubmission', { signal })
    ]).then(([resProblems, resContests, resSubs, resLastSub]) => {
      setProblemSolved(resProblems.data.problemSolved || 0);
      setContestGiven(resContests.data.count || 0);
      setRecentSubmission(resSubs.data.submissions || []);
      if (resLastSub.data.submission) {
        setLastAcceptedSubmission(parseDateVector(resLastSub.data.submission.createdAt));
      }
    }).catch(err => {
      if (err.name === 'CanceledError') return;
      console.error("Dashboard fetch error:", err);
    });

    return () => controller.abort();
  }, []); // Empty dependencies ensures this runs exactly once on mount

  useEffect(() => {
    if (authUser?.createdAt) { 
      setMemberSince(parseDateVector(authUser.createdAt)); 
    }
  }, [authUser?.createdAt]); // Listen only to the specific property

  const refreshClickHandle = useCallback(async (e) => {
    e.preventDefault();
    setIsRefreshing(true);
    setRecentSubmission([]);
    
    try {
      const res = await axiosInstance.get('/dashboard/recentSubmissions');
      setRecentSubmission(res.data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <motion.div
      className='min-h-full h-fit mt-24 mx-3 rounded-lg mb-10 p-4'
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/* 4 Tabs */}
      <motion.div className='flex flex-col md:flex-row justify-center items-center h-fit w-full space-y-5 md:space-y-0 md:space-x-5 '>
        
        {/* Total Problems Solved */}
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-200 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, y: -40 }} animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat text-primary/80">
            <div className="stat-title">Total Problems Solved</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": problemSolved, "--digits": Math.max(1, Math.ceil(Math.log10(problemSolved || 1))) }} aria-live="polite" aria-label={`${problemSolved}`}>0</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Total Contest Given */}
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-200 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, y: -80 }} animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat text-primary/80">
            <div className="stat-title">Total Contest Given</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": contestGiven, "--digits": Math.max(1, Math.ceil(Math.log10(contestGiven || 1))) }} aria-live="polite" aria-label={`${contestGiven}`}>0</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Member Since */}
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-200 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, y: -80 }} animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat text-primary/80">
            <div className="stat-title">Member Since</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[0] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[1] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[2] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Last accepted submission at */}
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-200 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, y: -80 }} animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat text-primary/80">
            <div className="stat-title">Last accepted submission at</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[0] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[1] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[2] || 0, "--digits": 2 }} aria-live="polite">00</span>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div>
        <div className='mt-8 flex justify-between items-center px-1 mb-3 bg-base-200 rounded-lg py-2'>
          <div className='w-fit px-4'>
            <span>Recent Submissions</span>
          </div>
          <div className='space-x-2 mr-1'>
            <button disabled={isRefreshing} onClick={refreshClickHandle} className='w-20 btn btn-ghost hover:shadow-none shadow-none outline-none hover:outline-none hover:text-primary px-5 transition-colors duration-300 '>
              <AnimatePresence mode='wait'>
                {isRefreshing ? <span key='refreshing' className='loading loading-spinner loading-md'></span> : <span key='refreshed'>Refresh</span>}
              </AnimatePresence>
            </button>
            <Link to='/dashboard/submissions' className='btn btn-ghost hover:shadow-none shadow-none outline-none hover:outline-none hover:text-primary px-5 transition-colors duration-300 '>
              View All
            </Link>
          </div>
        </div>

        <motion.div layout className='w-full bg-base-100/25 backdrop-blur-xs rounded-lg px-16'>
          <table className='min-w-max w-full table-fixed'>
            <thead className='font-bold'>
              <tr className='border-b border-base-300 '>
                <th className='p-3 font-semibold'>Submission ID</th>
                <th className='p-3 font-semibold'>Status</th>
                <th className='p-3 font-semibold hidden sm:table-cell'>Time(ms)</th>
                <th className='p-3 font-semibold hidden sm:table-cell'>Memory(MB)</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='wait'>
                {recentSubmission.map((submission, idx) => (
                  <motion.tr
                    key={submission._id}
                    layout
                    variants={ROW_VARIANTS}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`${idx === recentSubmission.length - 1 ? '' : ' border-b'} border-base-300 hover:bg-base-200 transition-colors duration-300`}
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

                {recentSubmission.length === 0 && !isRefreshing && (
                  <motion.tr
                    key="no-submission-found"
                    layout
                    variants={EMPTY_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No recent submissions
                    </td>
                  </motion.tr>
                )}

                {recentSubmission.length === 0 && isRefreshing && (
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
      </motion.div>
    </motion.div>
  );
});

Dashboard.displayName = 'Dashboard';
export default Dashboard;