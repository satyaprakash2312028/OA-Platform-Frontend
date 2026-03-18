import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, number } from 'motion/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../lib/axios'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
const MotionLink = motion.create(Link)
const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const { pageNumber } = useParams();
  const [receivedPageNumber, setReceivedPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {

    axiosInstance.get(`/problem/submissions/page/${pageNumber}`)
      .then(res => {

        setSubmissions(res.data.submissions);
        setReceivedPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        console.log(res.data.submissions)
        setLoading(false);
      }).catch(err => {
        setLoading(false);
        setSubmissions([]);

      })
  }, [pageNumber, axiosInstance])
  return (
    <>
      <div className='mt-24 flex justify-between items-center px-1 mb-4 bg-base-200 mx-4 rounded-lg py-3'>
        <div className='w-fit px-4'>
          <span className='font-semibold text-lg'>All  Submissions</span>
        </div>
        <div className='space-x-2 mr-1'>
          <div className="join space-x-2 scale-[102%]">
            <MotionLink
              to={(Number(receivedPageNumber) <= 1 || loading) ? undefined : `/dashboard/submissions/page/${Number(receivedPageNumber) - 1}`}
              onClick={(e) => { if (Number(receivedPageNumber) > 1) setLoading(true); if (Number(receivedPageNumber) <= 1) e.preventDefault(); }}
              className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(receivedPageNumber) <= 1 ? 'opacity-0' : ''}`}><ChevronLeftIcon size={18} /></MotionLink>
            <motion.span
              layout
              className="join-item opacity-100 transition-all duration-300 btn btn-ghost btn-circle border-none shadow-none bg-transparent">
              <AnimatePresence mode='popLayout'>{loading ? (<motion.span
                key='span_pageNumber_loader'
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, type: 'tween' }}
                className='loading loading-spinner size-6 text-base-100/75'></motion.span>) : <motion.span key='span_pageNumber_finished' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, type: 'tween' }}>{receivedPageNumber}</motion.span>}
              </AnimatePresence>
            </motion.span>
            <MotionLink
              to={(Number(receivedPageNumber) >= Number(totalPages) || loading) ? undefined : `/dashboard/submissions/page/${Number(receivedPageNumber) + 1}`}
              onClick={(e) => { if (Number(receivedPageNumber) < Number(totalPages)) setLoading(true); if (Number(receivedPageNumber) >= Number(totalPages)) e.preventDefault(); }}
              className={`join-item rounded-full transition-all duration-300 hover:bg-base-100/75  btn btn-ghost btn-circle border-none shadow-none bg-base-200/40 ${Number(receivedPageNumber) >= Number(totalPages) ? 'opacity-0' : ''}`}><ChevronRightIcon size={18} /></MotionLink>
          </div>
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
              <th className='p-3 font-semibold hidden sm:table-cell'>Memory(KB)</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='wait'>
              {
                submissions.map((submission, idx) => (
                  <motion.tr
                    key={submission._id}
                    layout
                    className={`${idx === submissions.length - 1 ? '' : ' border-b'} border-base-300 hover:bg-base-200 transition-colors duration-300`}
                    initial={{ scale: 0.8, opacity: 0, translateY: -50 }}
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

              {submissions.length === 0 && !loading && ((
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

              {submissions.length === 0 && loading && ((
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
    </>
  )
}

export default SubmissionsPage