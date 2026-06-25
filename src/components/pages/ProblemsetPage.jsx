import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRightIcon, ChevronLeftIcon, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../../lib/axios.js';
import toast from 'react-hot-toast';

const MotionLink = motion.create(Link);

// Hoisted Variants
const ROW_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delayAmt) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, type: "spring", delay: delayAmt } }),
  exit: { opacity: 0, scale: 0.8 }
};

const ProblemsetPage = React.memo(() => {
  const { paramPage } = useParams();
  
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [problems, setProblems] = useState([]);
  const requestedPage = Number(paramPage) || 1;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    axiosInstance.get(`/problem/allProblems/page/${requestedPage}`, { signal: controller.signal })
      .then(res => {
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setProblems(res.data.problems);
      })
      .catch(error => {
        if (error.name === 'CanceledError') return;
        toast.dismiss();
        toast.error(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

      return () => controller.abort();
  }, [requestedPage]);

  return (
    <motion.div
      className="mt-36 mx-6 lg:mx-36 min-w-fit mb-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <ul className="list bg-base-200/40 backdrop-blur-xs rounded-box shadow-md">
        <motion.li
          className="p-4 pb-6 text-base tracking-wide w-full space-x-2 flex justify-between items-center"
          initial={{ x: -10, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <span className="p-4 pb-2 opacity-60 tracking-wide flex items-center space-x-2">
            <Wrench size={18} />
            <span className="tracking-wide">Problemset</span>
          </span>
          <div className='space-x-2 mr-1'>
            <div className="join space-x-2 scale-[102%]">
                <MotionLink
                  to={(Number(pageNumber) <= 1 || isLoading) ? undefined : `/problemset/page/${Number(pageNumber) - 1}`}
                  onClick={(e) => { if (Number(pageNumber) > 1) setIsLoading(true); if (Number(pageNumber) <= 1) e.preventDefault(); }}
                  className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) <= 1 ? 'opacity-0' : ''}`}
                >
                  <ChevronLeftIcon size={18} />
                </MotionLink>
              
              <motion.span layout className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">
                <AnimatePresence mode='popLayout'>
                  {isLoading ? (
                    <motion.span key='span_pageNumber_loader' exit={{ opacity: 0 }} transition={{ duration: 0.2, type: 'tween' }} className='loading loading-spinner size-6 text-base-100/75'></motion.span>
                  ) : (
                    <motion.span key='span_pageNumber_finished' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, type: 'tween' }}>{pageNumber}</motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              
              <MotionLink
                to={(Number(pageNumber) >= Number(totalPages) || isLoading) ? undefined : `/problemset/page/${Number(pageNumber) + 1}`}
                onClick={(e) => { if (Number(pageNumber) < Number(totalPages)) setIsLoading(true); if (Number(pageNumber) >= Number(totalPages)) e.preventDefault(); }}
                className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) >= Number(totalPages) ? 'opacity-0' : ''}`}
              >
                <ChevronRightIcon size={18} />
              </MotionLink>
            </div>
          </div>
        </motion.li>
        
        <AnimatePresence mode='wait' layout>
          {problems.map((p, idx) => {
            const hue = 100 + (p.points - 500) * 260 / 2000;
            return (
              <motion.li
                className="list-row items-center p-3 cursor-pointer" 
                key={p._id}
                variants={ROW_VARIANTS}
                custom={0.1 * idx / problems.length}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => navigate(`/problem/${p._id}`)}
              >
                <div className='w-5 flex justify-center items-center'>
                  {p.isSolved && <Check size={15} className='text-success' />}
                </div>
                <div>
                  <div className='overflow-hidden'><span className="text-[0.95rem] font-[sans-serif] tracking-wider">{p.name}</span></div>
                </div>
                <span className="text-[1rem] font-mono opacity-55" style={{ color: `hsl(${hue}, 100%, 50%)` }}>
                  {p.points}
                </span>
                <span className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 lg:ml-10 ml-3">
                  <ChevronRightIcon size={20} className='text-primary' />
                </span>
              </motion.li>
            );
          })}
          {isLoading && !problems.length && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring' }}
              key='loading_contests' 
              className='list-row w-full flex justify-center items-center'
            >
              <span className='text-base-100/75 loading loading-dots size-6'></span>
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
});

ProblemsetPage.displayName = 'ProblemsetPage';
export default ProblemsetPage;