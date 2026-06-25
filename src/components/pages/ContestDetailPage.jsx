import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import Timer from '../Timer.jsx';
import { Check, ChevronRightIcon, Trophy } from 'lucide-react';

const MotionLink = motion.create(Link);

const ROW_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (idx) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, type: "spring", delay: 0.1 * idx } }),
  exit: { opacity: 0, scale: 0.8 }
};

const ContestDetailPage = React.memo(() => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!contestId) {
      navigate(-1);
      toast.error("No such contest");
      return;
    }

    const controller = new AbortController();

    axiosInstance.get(`/problem/assessment/${contestId}`, { signal: controller.signal })
      .then(res => {
        setProblems(res.data.problems);
        setStartTime(new Date(res.data.startTime));
        setEndTime(new Date(res.data.endTime));
        setIsLoading(false);
        setStarted(true);
      })
      .catch(error => {
        if (error.name === 'CanceledError') return;
        
        if (error.status === 423) {
          toast.dismiss();
          toast("Refresh the page at the contest start time to access the problems.", { icon: '⏳' });
          setStartTime(new Date(error.response.data.startTime));
          setEndTime(new Date(error.response.data.endTime));
          setIsLoading(false);
          setStarted(false);
        } else {
          navigate(-1);
          toast.error(error.response?.data?.message || "Failed to load contest");
        }
      });

      return () => controller.abort();
  }, [contestId, navigate]);

  if (isLoading) {
    return (
      <AnimatePresence layout>
        <motion.div
          key="problemset.loader"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center h-screen"
        >
          <span className="loading loading-infinity size-16"></span>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -35 }}
        className='w-max m-auto flex flex-col justify-center items-center mt-56 transition-colors duration-300'
      >
        <div className='mb-2 mx-auto'>Contest will start in :</div>
        <Timer endTime={startTime.getTime()} />
      </motion.div>
    );
  }

  const isContestLive = Date.now() >= startTime.getTime() && Date.now() <= endTime.getTime();

  return (
    <>
      {endTime.getTime() > Date.now() && (
        <motion.div 
          initial={{ y: -110 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className='shadow-lg z-100 bg-base-300/30 backdrop-blur-xs w-xl flex justify-center items-center rounded-4xl scale-45 fixed -right-35 top-5'
        >
          <Timer endTime={endTime.getTime()} />
        </motion.div>
      )}
      
      <div>
        <motion.div
          className="mt-52 mx-6 lg:mx-36 min-w-fit space-y-6 mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div className='flex items-center space-x-3'>
            <motion.button
              className="btn btn-primary mt-4 w-max shadow-md px-3 flex items-center space-x-2"
              initial={{ opacity: 0.2, scale: 0.8, y: -35 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" } }}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.3)", transition: { duration: 0.2, type: "tween" } }}
              whileTap={{ scale: 0.95, boxShadow: "0px 3px 15px -3px rgba(0, 0, 0, 0.3)", transition: { duration: 0.2, type: "tween" } }}
              onClick={() => navigate(`/leaderboard/${contestId}/page/1`)}
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </motion.button>
          </motion.div>
          
          <ul className="list bg-base-200/40 backdrop-blur-xs rounded-box shadow-md">
            <AnimatePresence mode='wait' layout>
              {problems.map((p, idx) => (
                <motion.li
                  key={p._id}
                  variants={ROW_VARIANTS}
                  custom={idx / problems.length}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="list-row items-center p-3" 
                >
                  <div className='w-5 flex justify-center items-center'>
                    {p.isSolved && <Check size={18} className='text-success' />}
                  </div>
                  <div>
                    <div className='overflow-hidden'>
                      <span className="text-[1rem]">{`${String.fromCharCode(('A').charCodeAt(0) + idx)}. ${p.name}`}</span>
                    </div>
                  </div>
                  <MotionLink
                    className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 lg:ml-10 ml-3"
                    to={`/problem/${isContestLive ? 'live/' : ''}${p._id}`}
                  >
                    <ChevronRightIcon size={18} className='text-primary' />
                  </MotionLink>
                </motion.li>
              ))}

              {problems.length === 0 && (
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  key='no_problems' className='list-row w-full flex justify-center items-center'
                >
                  <span className='text-lg'>No problems available.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </ul >
        </motion.div>
      </div>
    </>
  );
});

ContestDetailPage.displayName = 'ContestDetailPage';
export default ContestDetailPage;