import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon, Trophy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MotionLink = motion.create(Link);

const getProblemLetter = (index) => {
  let name = '';
  while (index >= 0) {
    name = String.fromCharCode((index % 26) + 65) + name;
    index = Math.floor(index / 26) - 1;
  }
  return name;
};

// Hoisted Row Variants to avoid memory churn
const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (idx) => ({ opacity: 1, y: 0, transition: { duration: 0.3, type: "spring", delay: 0.03 * idx } }),
  exit: { opacity: 0 }
};

const Leaderboard = React.memo(() => {
  const { contestId, paramPage } = useParams();
  
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [teams, setTeams] = useState([]);
  const [selfData, setSelfData] = useState(null);
  
  const [contestProblems, setContestProblems] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  const requestedPage = Number(paramPage) || 1;
  const navigate = useNavigate();

  const pageSize = 25; 

  useEffect(() => {
    if (!contestId) {
      navigate(-1);
      toast.error("No such contest");
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    axiosInstance.get(`/dashboard/leaderboard/${contestId}/${requestedPage}`, { signal: controller.signal })
      .then(res => {
        setPageNumber(res.data.pageNumber || requestedPage);
        setTotalPages(res.data.totalPages || 1);
        setTeams(res.data.teams || []);
        setSelfData(res.data.self || null);
        
        setContestProblems(res.data.problems || []);
        if (res.data.startTime) setStartTime(new Date(res.data.startTime));
        if (res.data.endTime) setEndTime(new Date(res.data.endTime));
      })
      .catch(error => {
        if (error.name === 'CanceledError') return;
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to fetch leaderboard");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

      return () => controller.abort();
  }, [contestId, requestedPage, navigate]);

  const isLive = useMemo(() => {
    return startTime && endTime && Date.now() >= startTime.getTime() && Date.now() <= endTime.getTime();
  }, [startTime, endTime]);

  const getProblemUrl = (pid) => `/problem/${isLive ? 'live/' : ''}${pid}`;

  return (
    <div className="mt-36 mx-6 lg:mx-36 min-w-fit mb-10 flex flex-col gap-6">
      
      {/* Navigation Controls */}
      <motion.div
        className='flex items-center space-x-3'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <motion.button
          className="btn btn-primary mt-4 w-max shadow-md px-3"
          initial={{ opacity: 0.2, scale: 0.8, y: -35 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" } }}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.3)", transition: { duration: 0.2, type: "tween" } }}
          whileTap={{ scale: 0.95, boxShadow: "0px 3px 15px -3px rgba(0, 0, 0, 0.3)", transition: { duration: 0.2, type: "tween" } }}
          onClick={() => navigate(`/contest/${contestId}`)}
        >
          <ChevronLeftIcon size={18} className="mr-1" />
          Back to Contest
        </motion.button>
      </motion.div>

      <motion.div
        className="bg-base-200/60 backdrop-blur-xs rounded-box shadow-md overflow-hidden font-mono"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Header & Pagination */}
        <div className="p-4 pb-4 ml-2 text-base tracking-wide w-full space-x-2 flex justify-between items-center border-b border-base-300">
          <div className="flex items-center space-x-2 opacity-60 p-2">
            <Trophy size={20} />
            <span className="tracking-wide">Standings</span>
          </div>

          <div className='space-x-2 mr-1'>
            <div className="join space-x-2 scale-[102%]">
              <MotionLink
                to={(Number(pageNumber) <= 1 || isLoading) ? undefined : `/leaderboard/${contestId}/page/${Number(pageNumber) - 1}`}
                onClick={(e) => { if (Number(pageNumber) > 1) setIsLoading(true); if (Number(pageNumber) <= 1) e.preventDefault(); }}
                className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) <= 1 ? 'opacity-0 cursor-default' : ''}`}
              >
                <ChevronLeftIcon size={18} />
              </MotionLink>

              <motion.span layout className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">
                <AnimatePresence mode='popLayout'>
                  {isLoading ? (
                    <motion.span key='span_pageNumber_loader' exit={{ opacity: 0 }} transition={{ duration: 0.2, type: 'tween' }} className='loading loading-spinner size-6 text-base-100/75' />
                  ) : (
                    <motion.span key='span_pageNumber_finished' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, type: 'tween' }}>
                      {pageNumber}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>

              <MotionLink
                to={(Number(pageNumber) >= Number(totalPages) || isLoading) ? undefined : `/leaderboard/${contestId}/page/${Number(pageNumber) + 1}`}
                onClick={(e) => { if (Number(pageNumber) < Number(totalPages)) setIsLoading(true); if (Number(pageNumber) >= Number(totalPages)) e.preventDefault(); }}
                className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) >= Number(totalPages) ? 'opacity-0 cursor-default' : ''}`}
              >
                <ChevronRightIcon size={18} />
              </MotionLink>
            </div>
          </div>
        </div>

        {/* Codeforces Style Table Container */}
        <div className="overflow-x-auto w-full pb-4">
          <table className="table table-zebra w-full text-center whitespace-nowrap">
            <thead>
              <tr className="border-b border-base-300 text-sm opacity-70">
                <th className="w-16">#</th>
                <th className="text-left min-w-60">Who</th>
                <th className="w-20 font-bold text-lg">=</th>
                {contestProblems.map((pid, idx) => (
                  <th key={pid} className="w-20 min-w-20">
                    <Link to={getProblemUrl(pid)} className="text-primary hover:underline hover:brightness-125 transition-all text-lg font-bold">
                      {getProblemLetter(idx)}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Pinned Self Data */}
              {!isLoading && selfData && pageNumber === 1 && (
                <motion.tr
                  className="bg-primary/10 border-b border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <td className='font-bold text-primary'>{selfData.rank}</td>
                  <td className="text-left font-bold text-primary">Your Team</td>
                  <td className="font-bold text-base">{(selfData.score).toFixed(3)}</td>
                  {contestProblems.map((pid) => (
                    <td key={`self-${pid}`}>
                      {(selfData.problems || []).includes(pid) ? <Check size={20} className="text-success mx-auto stroke-3" /> : null}
                    </td>
                  ))}
                </motion.tr>
              )}

              {/* Leaderboard Entries */}
              <AnimatePresence mode='wait'>
                {teams.map((t, idx) => {
                  const rank = (pageNumber - 1) * pageSize + idx + 1;
                  return (
                    <motion.tr
                      key={t.team + idx}
                      variants={ROW_VARIANTS}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="hover:bg-base-300/30 transition-colors duration-300"
                    >
                      <td className="opacity-50 font-semibold">{rank}</td>
                      <td className="text-left font-bold text-primary/50">{t.team}</td>
                      <td className="font-semibold text-base">{(t.score).toFixed(3)}</td>
                      {contestProblems.map((pid) => (
                        <td key={`${t.team}-${pid}`}>
                          {(t.problems || []).includes(pid) ? <Check size={20} className="text-success mx-auto stroke-[3]" /> : null}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Loaders and Empty States */}
          <AnimatePresence mode='popLayout'>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10}} transition={{ duration: 0.2 }}
                key='loading_leaderboard' className='w-full flex justify-center items-center py-12'
              >
                <span className='text-base-100/75 loading loading-dots size-6'></span>
              </motion.div>
            )}

            {!isLoading && teams.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                key='no_teams' className='w-full flex justify-center items-center py-12'
              >
                <span className='text-lg opacity-50'>No rankings available yet.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
});

Leaderboard.displayName = 'Leaderboard';
export default Leaderboard;