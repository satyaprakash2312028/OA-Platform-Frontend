import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import useProblemStore from '../../store/useProblemStore.js'
import { CheckCircle, FileText, ChevronLeft, ChevronRight, Check, ChevronRightIcon, ChevronLeftIcon, LucideRocket, Trophy, RockingChair, Wrench } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircleIcon } from 'lucide-react'
import axiosInstance from '../../lib/axios.js'
import toast from 'react-hot-toast'
const MotionLink = motion.create(Link);
// const SroblemsetPage = () => {
//   const { paramPage } = useParams();
//   const { pageNumber, isLoading, totalPages, problems, failed, loadPage } = useProblemStore();
//   const requestedPage = Number(paramPage) || 1;
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log(requestedPage);
//     loadPage(requestedPage);
//     console.log(pageNumber + "huhu");
//   }, [loadPage, requestedPage]);

//   if (isLoading) {
//     return (
//       <AnimatePresence>
//         <motion.div
//           key="problemset.loader"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 1.2, opacity: 0 }}
//           transition={{ duration: 0.6 }}
//           className="flex items-center justify-center h-screen">
//           <span className="loading loading-infinity size-16"></span>
//         </motion.div>
//       </AnimatePresence>
//     );
//   }

//   return (
//     <motion.div
//       className="mt-36 mx-6 lg:mx-36 min-w-fit"
//       initial={{ opacity: 0, translateY: -30 }}
//       animate={{ opacity: 1, translateY: 0 }}
//       exit={{ opacity: 0, translateY: -30 }}
//       transition={{ duration: 0.5, type: "spring" }}
//     >
//       <ul className="list bg-base-300 rounded-box shadow-md font-mono">
//         <motion.li
//           className="p-4 pb-6 text-base tracking-wide w-full space-x-2 flex justify-between items-center"
//           initial={{ translateX: -10, opacity: 0, scale: 0.5 }}
//           animate={{ translateX: 0, opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, type: "spring" }}
//         >

//           <span className='opacity-30 ' >Problemset</span>
//           <div className="join space-x-2 scale-[102%]">
//             <MotionLink
//               to={pageNumber === 1 ? undefined : `/problemset/page/${pageNumber - 1}`}
//               onClick={(e) => { if (pageNumber === 1) e.preventDefault(); }}
//               className="join-item rounded-full opacity-100 transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40"><ChevronLeftIcon size={18} /></MotionLink>
//             <span
//               className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">{pageNumber}</span>
//             <MotionLink
//               to={pageNumber === totalPages ? undefined : `/problemset/page/${pageNumber + 1}`}
//               onClick={(e) => { if (pageNumber === totalPages) e.preventDefault(); }}
//               className="join-item rounded-full opacity-100 transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40"><ChevronRightIcon size={18} /></MotionLink>
//           </div>

//         </motion.li>
//         {problems.map((p, idx) => (
//           <motion.li
//             className="list-row items-center p-3" key={p._id}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.4, type: "spring", delay: (0.1 * idx / problems.length) }}
//           >
//             <div className='w-5 flex justify-center items-center'>
//               {p.isSolved ? <Check size={18} className='text-success' /> : <></>}
//             </div>
//             <div>
//               <div className='overflow-hidden'><span className="text-[1.1rem] font-mono">{p.name}</span></div>
//               {/* <div className="text-xs uppercase font-semibold opacity-60">Cappuccino</div> */}
//             </div>
//             <span className="text-[1rem] font-mono opacity-55"
//               style={{ color: `rgb(8, 247, 247)` }}
//             >{Math.floor(Math.random() * (100 - 1 + 1)) + 1}</span>
//             <MotionLink
//               className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 lg:ml-10 ml-3"
//               to={`/problem/${p._id}`}
//             >
//               <ChevronRightIcon size={18} />
//             </MotionLink>
//             {/* <button className="btn btn-square btn-ghost">
//               <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
//             </button> */}
//           </motion.li>
//         ))}
//       </ul >
//     </motion.div>
//   );

// }


const ProblemsetPage = () => {
  const { paramPage } = useParams();
  // const { pageNumber, isLoading, totalPages, problems, failed, loadPage } = useProblemStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [problems, setProblems] = useState([]);
  const requestedPage = Number(paramPage) || 1;
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/problem/allProblems/page/${requestedPage}`)
      .then(res => {
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setProblems(res.data.problems);
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
      transition={{ duration: 0.5, type: "spring" }}
    >
      <ul className="list bg-base-200/40 backdrop-blur-xs rounded-box shadow-md font-mono">
        <motion.li
          className="p-4 pb-6 text-base tracking-wide w-full space-x-2 flex justify-between items-center"
          initial={{ translateX: -10, opacity: 0, scale: 0.5 }}
          animate={{ translateX: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >

          <span className="p-4 pb-2 opacity-60 tracking-wide flex items-center space-x-2">
            <Wrench size={18}/>
            <span className="tracking-wide">Problemset</span>
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
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, type: 'tween' }}
                  className='loading loading-spinner size-6 text-base-100/75'></motion.span>) : <motion.span key='span_pageNumber_finished' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, type: 'tween' }}>{pageNumber}</motion.span>}
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
          {problems.map((p, idx) => (
            <motion.li
              className="list-row items-center p-3" key={p._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring", delay: (0.1 * idx / problems.length) }}
              // onHoverStart={{ scale: 1.05, transition: { duration: 0.2, type: "tween" } }}
              onClick={() => {navigate(`/problem/${p._id}`)}}
            >
              <div className='w-5 flex justify-center items-center'>
                {p.isSolved ? <Check size={15} className='text-success' /> : <></>}
              </div>
              <div>
                <div className='overflow-hidden'><span className="text-[1.1rem] font-mono">{p.name}</span></div>
              </div>
              <span className="text-[1rem] font-mono opacity-55"
                style={{ color: `hsl(${100+ (p.points - 500)*260/2000}, 100%, 50%)` }}
              >{p.points}</span>
              <span
                className="hover:scale-120 transition-all duration-300 hover:bg-base-300/75 btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 lg:ml-10 ml-3"
              >
                <ChevronRightIcon size={20}  className='text-primary'/>
              </span>
              {/* <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button> */}
            </motion.li>
          ))}
          {isLoading && !problems.length && (
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

export default ProblemsetPage
