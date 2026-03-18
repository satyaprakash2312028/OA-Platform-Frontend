import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
// import useContestStore from '../../store/useContestStore'
import axiosInstance from '../../lib/axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'
import Timer from '../Timer.jsx'
import { Check, ChevronRightIcon } from 'lucide-react'
const MotionLink = motion.create(Link)
const ContestDetailPage = () => {
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
    axiosInstance.get(`/problem/assessment/${contestId}`)
      .then(res => {
        setProblems(res.data.problems);
        console.log(res.data);
        setStartTime(new Date(res.data.startTime));
        setEndTime(new Date(res.data.endTime));
        setIsLoading(false);
        setStarted(true);
      })
      .catch(error => {
        if (error.status == 423) {
          toast.dismiss();
          toast("Refresh the page at the contest start time to access the problems.", { icon: '⏳' });
          setStartTime(new Date(error.response.data.startTime));
          setEndTime(new Date(error.response.data.endTime));
          setIsLoading(false);
          setStarted(false);
        } else {
          navigate(-1);
          toast.error(error.response.data.message);
        }
      })

  }, [contestId, navigate, toast]);

  if (isLoading) {
    return (
      <AnimatePresence layout>
        <motion.div
          key="problemset.loader"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center h-screen">
          <span className="loading loading-infinity size-16"></span>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!started) {
    return (<motion.div
      initial={{ opacity: 0, y: -35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -35 }}
      className='w-max m-auto flex flex-col justify-center items-center mt-56 transition-colors duration-300'>
      <div className='mb-2 mx-auto'>Contest will start in :</div>
      <Timer endTime={(new Date(startTime)).getTime()} />
    </motion.div>)


  }

  return (
    <>
      {((new Date(endTime)).getTime()>Date.now())&&<motion.div 
      initial={{y:-350}}
      animate={{y:0}}
      transition={{duration:0.5, type:"spring", delay:0.3}}
      className='bg-base-200/50 shadow-2xl rounded-b-4xl fixed top-0 right-0 scale-50 w-fit translate-y-2 translate-x-33'>
        <Timer endTime={(new Date(endTime)).getTime()} />
      </motion.div>}
      <div>
        <motion.div
          className="mt-52 mx-6 lg:mx-36 min-w-fit"
          initial={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -30 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <ul className="list bg-base-200 rounded-box shadow-md font-mono">
            <AnimatePresence mode='wait' layout>
              {problems.map((p, idx) => (
                <motion.li
                  className="list-row items-center p-3" key={p._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, type: "spring", delay: (0.1 * idx / problems.length) }}
                >
                  <div className='w-5 flex justify-center items-center'>
                    {p.isSolved ? <Check size={18} className='text-success' /> : <></>}
                  </div>
                  <div>
                    <div className='overflow-hidden'><span className="text-[1.1rem] font-mono">{p.name}</span></div>
                    {/* <div className="text-xs uppercase font-semibold opacity-60">Cappuccino</div> */}
                  </div>
                  <MotionLink
                    className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 lg:ml-10 ml-3"
                    to={`/problem/${(Date.now() >= startTime && Date.now() <= endTime) ? 'live/' : ''}${p._id}`}
                  >
                    <ChevronRightIcon size={18} />
                  </MotionLink>
                  {/* <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button> */}
                </motion.li>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ translateY: -10, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ translateY: -10, opacity: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  key='loading_contests' className='list-row w-full flex justify-center items-center'>
                  <span className='text-base-100/75 loading loading-dots size-6'></span>
                </motion.div>
              )}
              {problems.length === 0 && !isLoading && (
                <motion.div
                  initial={{ translateY: -40, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ translateY: -40, opacity: 0 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  key='no_problems' className='list-row w-full flex justify-center items-center'>
                  <span className='text-lg'>No problems available.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </ul >
        </motion.div>
      </div>
    </>
  );



}

export default ContestDetailPage