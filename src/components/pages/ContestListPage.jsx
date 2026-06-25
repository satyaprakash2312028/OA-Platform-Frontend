import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
// import useContestStore from '../../store/useContestStore'
import axiosInstance from '../../lib/axios'
import toast from 'react-hot-toast'
import { Dot, ChevronLeftIcon, ChevronRightIcon, Space, List } from 'lucide-react'
import { parseDateVector, parseDateToString, parseTimeVector } from '../../lib/utility'
import { motion, AnimatePresence } from 'motion/react'
const MotionLink = motion.create(Link);
const ContestListPage = () => {
  const { paramPage } = useParams();
  // const { pageNumber, isLoading, totalPages, problems, failed, loadPage } = useProblemStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [contests, setContests] = useState([]);
  const requestedPage = Number(paramPage) || 1;
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/dashboard/getContests/page/${requestedPage}`)
      .then(res => {
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setContests(res.data.assessments);
        console.log(res.data.assessments);
        setIsLoading(false);
      }).catch(error => {
        console.log(error);
        toast.dismiss();
        toast.error(error.message);
      })
  }, [requestedPage]);

  return (
    <motion.div
      className="mt-36 mx-6 lg:mx-36 min-w-fit mb-10"
      initial={{ opacity: 0, translateY: -30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -30 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <ul className="list bg-base-200/40 backdrop-blur-xs rounded-box shadow-md">
        <motion.li
          className="p-4 pb-6 ml-6 text-base tracking-wide w-full space-x-2 flex justify-between items-center"
          initial={{ translateX: -10, opacity: 0, scale: 0.5 }}
          animate={{ translateX: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >

          <span className="p-4 pb-2 opacity-60 tracking-wide flex items-center space-x-2">
          <List size={18}/><span>Contests</span>
          </span>
          <div className='space-x-2 mr-1'>
            <div className="join space-x-2 scale-[102%]">
              <MotionLink
                to={(Number(pageNumber) <= 1 || isLoading) ? undefined : `/problemset/page/${Number(pageNumber) - 1}`}
                onClick={(e) => { if (Number(pageNumber) > 1) setIsLoading(true); if (Number(pageNumber) <= 1) e.preventDefault(); }}
                className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) <= 1 ? 'opacity-0' : ''}`}><ChevronLeftIcon size={18} /></MotionLink>
              <motion.span
              layout
                className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">
                  <AnimatePresence mode='popLayout'>{isLoading ? (<motion.span 
                  key='span_pageNumber_loader'
                  exit={{opacity:0}}
                  transition={{duration:0.2, type:'tween'}}
                  className='loading loading-spinner size-6 text-base-100/75'></motion.span>) : <motion.span key='span_pageNumber_finished' initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.2, type:'tween'}}>{pageNumber}</motion.span>}
                  </AnimatePresence>
              </motion.span>
              <MotionLink
                to={(Number(pageNumber) >= Number(totalPages) || isLoading) ? undefined : `/problemset/page/${Number(pageNumber) + 1}`}
                onClick={(e) => { if (Number(pageNumber) < Number(totalPages)) setIsLoading(true); if (Number(pageNumber) >= Number(totalPages)) e.preventDefault(); }}
                className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(pageNumber) >= Number(totalPages) ? 'opacity-0' : ''}`}><ChevronRightIcon size={18} /></MotionLink>
            </div>
          </div>

        </motion.li>
        
          
            <AnimatePresence mode='wait' layout>
          {contests.map((p, idx) => (
            <motion.li
              className={`list-row items-center p-6 space-x-1 `} key={p._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring", delay: (0.1 * idx / contests.length) }}
            >
              <div className='w-5 flex justify-center items-center'>
                {p.isRegistered ? (<Dot className={`text-success size-max ${(Date.now()<new Date(p.endTime)&&Date.now()>new Date(p.startTime))?'loading loading-ring loading-md':''}`}></Dot>) : <></>}
              </div>
              <div>
                <div className='overflow-hidden'><span className={`text-[1.2rem] tracking-wider ${Date.now()>(new Date(p.endTime))?'opacity-35':''}`}>{p.title}</span></div>
                {/* <div className="text-xs uppercase font-semibold opacity-60">Cappuccino</div> */}
              </div>
              <span 
              className="text-[0.85rem] tracking-widest text-base-content/55">
                {parseDateToString((new Date(p.startTime)))}
                <br></br>
                {(parseTimeVector(new Date(p.startTime))[0]).toString().padStart(2, '0')}:
                {(parseTimeVector(new Date(p.startTime))[1]).toString().padStart(2, '0')} 
                {(parseTimeVector(new Date(p.startTime))[0])>11?' PM':' AM'}
                
              </span>
              <MotionLink
                className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75 p-3 rounded-full bg-base-200/40 lg:ml-10 ml-3"
                to={
                  Date.now()>(new Date(p.endTime))?`/contest/${p._id}`:(Date.now()<(new Date(p.startTime))?(p.isRegistered?`/contest/${p._id}`:`/register/${p._id}`):`/contest/${p._id}`)
                }
              >
                <span className='text-primary'><ChevronRightIcon size={18}/></span>
              </MotionLink>
              {/* <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button> */}
            </motion.li>
          ))}
          {isLoading && (
            <motion.div 
            initial={{translateY:-10, opacity:0}}
            animate={{translateY:0, opacity:1}}
            exit={{translateY:-10, opacity:0}}
            transition={{duration:0.4, type:'spring'}}
            key='loading_contests' className='list-row w-full flex justify-center items-center'>
              <span className='text-base-100/75 loading loading-dots size-6'></span>
            </motion.div>
          )}
          </AnimatePresence>
          
        
      </ul >
    </motion.div>
  );

}

export default ContestListPage