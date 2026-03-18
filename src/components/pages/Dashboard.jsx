import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LayoutDashboardIcon, Calendar, Award, CheckSquare, FileText, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../lib/axios'
// import useSubmissionStore from '../../store/useSubmissionStore'
import useAuthStore from '../../store/useAuthStore'
import { parseDateVector } from '../../lib/utility.js'

const Dashboard = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const [problemSolved, setProblemSolved] = useState(0);
  const [contestGiven, setContestGiven] = useState(0);
  const [memberSince, setMemberSince] = useState([0, 0, 0]);
  const [lastAcceptedSubmission, setLastAcceptedSubmission] = useState([0, 0, 0]);
  const [recentSubmission, setRecentSubmission] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    console.log("mounted");
    axiosInstance.get('/dashboard/problemSolved')
      .then(res => { setProblemSolved(res.data.problemSolved); console.log(res.data.problemSolved); })
    axiosInstance.get('/dashboard/totalContestCount')
      .then(res => { setContestGiven(res.data.count); })
    axiosInstance.get('/dashboard/recentSubmissions')
      .then(res => { setRecentSubmission(res.data.submissions); })
    axiosInstance.get('/dashboard/lastAcceptedSubmission')
      .then(res => { setLastAcceptedSubmission(parseDateVector(res.data.submission.createdAt)); })
  }, [axiosInstance, setRecentSubmission, setProblemSolved, setContestGiven, setLastAcceptedSubmission, parseDateVector]);
  useEffect(() => {
    if (authUser?.createdAt != undefined) { setMemberSince(parseDateVector(authUser?.createdAt)); }
  }, [isCheckingAuth, authUser, setMemberSince, parseDateVector]);
    const refreshClickHandle = (e) => {
      e.preventDefault();
      setRecentSubmission([]);
      setIsRefreshing(true);
      axiosInstance.get('/dashboard/recentSubmissions')
        .then(res => { setRecentSubmission(res.data.submissions); setIsRefreshing(false); })
    }
  return (
    <motion.div
      className='min-h-full h-fit mt-24 bg-base-300 mx-3 rounded-lg mb-10 p-4'
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/*4 Tabs*/}
      <motion.div
        className='flex flex-col md:flex-row justify-center items-center h-fit w-full space-y-5 md:space-y-0 md:space-x-5 '
      >
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-100 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, translateY: -40 }}
          animate={{ scale: 1, translateY: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat hover:text-primary hover:animate-pulse transition-colors duration-300">
            <div className="stat-title">Total Problems Solved</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": problemSolved, "--digits": Math.ceil(Math.log10(problemSolved)) }} aria-live="polite" aria-label={problemSolved}>0</span>
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-100 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, translateY: -80 }}
          animate={{ scale: 1, translateY: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat hover:text-primary hover:animate-pulse transition-color duration-300">
            <div className="stat-title">Total Contest Given</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": contestGiven, "--digits": Math.ceil(Math.log10(contestGiven)) }} aria-live="polite" aria-label={contestGiven}>0</span>
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-100 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, translateY: -80 }}
          animate={{ scale: 1, translateY: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat hover:text-primary hover:animate-pulse transition-color duration-300">
            <div className="stat-title">Member Since</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[0], "--digits":2 }} aria-live="polite" aria-label={memberSince[0]}>00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[1], "--digits":2 }} aria-live="polite" aria-label={memberSince[1]}>00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": memberSince[2], "--digits":2 }} aria-live="polite" aria-label={memberSince[2]}>00</span>
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className='stats min-w-max shadow rounded-lg w-full h-48 bg-base-100 hover:shadow-lg flex justify-center overflow'
          initial={{ scale: 0.4, translateY: -80 }}
          animate={{ scale: 1, translateY: 0 }}
          whileHover={{ scale: 1.03, transition: { type: "tween", duration: 0.3 } }}
        >
          <div className="stat hover:text-primary hover:animate-pulse transition-color duration-300">
            <div className="stat-title">Last accepted submission at</div>
            <div className="stat-value mx-auto">
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[0], "--digits":2}} aria-live="polite" aria-label={lastAcceptedSubmission[0]}>00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[1], "--digits":2 }} aria-live="polite" aria-label={lastAcceptedSubmission[1]}>00</span>
              </span>
              <span>-</span>
              <span className="countdown font-mono sm:text-4xl text-3xl">
                <span style={{ "--value": lastAcceptedSubmission[2], "--digits":2 }} aria-live="polite" aria-label={lastAcceptedSubmission[2]}>00</span>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div>
        <div className='mt-8 flex justify-between items-center px-1 mb-3 bg-base-100 rounded-lg py-2'>
          <div className='w-fit px-4'>
            <span>Recent  Submissions</span>
          </div>
          <div className='space-x-2 mr-1'>
            <button disabled={isRefreshing} onClick={refreshClickHandle} className='w-20 btn btn-ghost hover:shadow-none shadow-none outline-none hover:outline-none hover:bg-primary/75 px-5 transition-colors duration-300 '>
              <AnimatePresence mode='wait'>
                {isRefreshing ? <span key='refreshing' className='loading loading-spinner loading-md'></span> : <span key='refreshed'>Refresh</span>}
              </AnimatePresence>
            </button>
            <Link to='/dashboard/submissions'className='btn btn-ghost hover:shadow-none shadow-none outline-none hover:outline-none hover:bg-primary/75 px-5 transition-colors duration-300 '>
              View All
            </Link>
          </div>

        </div>
        <motion.div
                layout className='w-full bg-base-100 rounded-lg px-16'>
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
                      {
                        recentSubmission.map((submission, idx) => (
                          <motion.tr
                            key={submission._id}
                            layout
                            className={`${idx === recentSubmission.length - 1 ? '' : ' border-b'} border-base-300 hover:bg-base-200 transition-colors duration-300`}
                            initial={{ scale: 0, opacity: 0, translateY: -50 }}
                            animate={{ scale: 1, opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, type: "spring", delay: idx*0.02 }}
                          >
                            <td key={`submission-1-${submission._id}`} className='text-info brightness-85 text-center p-5 font-mono sm:whitespace-nowrap sm:overflow-hidden truncate '><Link to={`/submission/${submission._id}`} className='hover:underline'>{submission._id}</Link></td>
                            <td key={`submission-2-${submission._id}`} className={`text-center p-5 font-mono  sm:whitespace-nowrap sm:overflow-hidden truncate  ${submission.status === 'Accepted' ? 'text-success' : 'text-error'}`}>{submission.status}</td>
                            <td key={`submission-3-${submission._id}`} className='text-center p-5 font-mono hidden sm:table-cell sm:whitespace-nowrap sm:overflow-hidden truncate '>{submission.executionTime ?? '-'}</td>
                            <td key={`submission-4-${submission._id}`} className='text-center p-5 font-mono hidden sm:table-cell sm:whitespace-nowrap sm:overflow-hidden truncate '>{submission.memoryUsed ?? '-'}</td>
                          </motion.tr>
                        ))
                      }
        
                      {recentSubmission.length === 0 && !isRefreshing && ((
                        <motion.tr
                          key="no-submission-found"
                          layout
                          initial={{ scale: 0, opacity: 0, translateY: -50 }}
                          animate={{ scale: 1, opacity: 1, translateY: 0 }}
                          transition={{ duration: 0.3, type: "spring" }}
                          exit={{ scale: 0, opacity: 0, translateY: -50 }}
                        >
                          <td colSpan="4" key='no-submission-found-1' className="text-center p-4 text-gray-500">
                            No recent submissions
                          </td>
                        </motion.tr>)
                      )}
        
                      {recentSubmission.length === 0 && isRefreshing && ((
                        <motion.tr
                          key="no-submission-found"
                          layout
                          initial={{ scale: 0.8, opacity: 0, translateY: -50 }}
                          animate={{ scale: 1, opacity: 1, translateY: 0 }}
                          transition={{ duration: 0.5, type: "spring"}}
                          exit={{ scale: 0, opacity: 0, translateY: -50 }}
                        >
                          <td colSpan="4" key='no-submission-found-1' className='text-center'>
                            <span className="loading loading-dots loading-md size-7 text-base-200 pt-10"></span>
                          </td>
                        </motion.tr>)
                      )}
        
                    </AnimatePresence>
        
                  </tbody>
                </table>
              </motion.div>

      </motion.div>
    </motion.div>
  )
}

export default Dashboard
