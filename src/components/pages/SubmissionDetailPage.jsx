import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, 
  Clock, Cpu, Terminal, FileCode2, Link as LinkIcon, 
  Copy, Check, ShieldAlert, Archive
} from 'lucide-react';
import axiosInstance from '../../lib/axios.js';
import toast from 'react-hot-toast';

// 1. Hoist Animation Variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, ease: "easeOut" } }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const SubmissionDetailPage = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 2. AbortController for Race Conditions & Memory Leaks
    const controller = new AbortController();
    setIsLoading(true);

    axiosInstance.get(`/problem/code/${id}`, { signal: controller.signal })
      .then(res => {
        setSubmission(res.data);
      })
      .catch(err => {
        if (err.name === 'CanceledError') return;
        console.error(err);
        toast.error("Failed to load submission details");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

      return () => controller.abort();
  }, [id]);

  const handleCopyCode = () => {
    if (submission?.code) {
      navigator.clipboard.writeText(submission.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Code copied to clipboard!");
    }
  };

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('accepted') || s === 'ac') {
      return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: <CheckCircle2 size={24} /> };
    }
    if (s.includes('wrong') || s === 'wa') {
      return { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: <XCircle size={24} /> };
    }
    if (s.includes('time') || s === 'tle') {
      return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: <Clock size={24} /> };
    }
    return { color: 'text-base-content', bg: 'bg-base-content/10', border: 'border-base-content/20', icon: <AlertCircle size={24} /> };
  };

  const statusUI = getStatusDisplay(submission?.status);

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-5xl"
        initial="hidden"
        animate="show"
        variants={CONTAINER_VARIANTS}
      >
        <motion.div variants={ITEM_VARIANTS} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-circle btn-sm btn-ghost bg-base-200/50 border border-base-content/10 hover:bg-base-content/10 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">
                <FileCode2 size={14} />
                <span>Submission Record</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-wider text-base-content flex items-center gap-3">
                <span className="opacity-50">#</span> {id.slice(-8).toUpperCase()}
              </h1>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex justify-center items-center py-32"
            >
              <span className="loading loading-spinner loading-lg text-primary/50"></span>
            </motion.div>
          ) : !submission ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-base-content/40"
            >
              <ShieldAlert size={48} className="mb-4 opacity-20" />
              <p className="font-mono text-sm uppercase tracking-widest">Submission not found</p>
            </motion.div>
          ) : (
            <motion.div key="content" variants={CONTAINER_VARIANTS} className="space-y-6">
              <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Status Card */}
                <div className={`col-span-2 md:col-span-1 p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-center ${statusUI.bg} ${statusUI.border}`}>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Verdict</span>
                  <div className={`flex items-center gap-2 font-mono text-lg font-black ${statusUI.color}`}>
                    {statusUI.icon}
                    <span>{submission.status || 'Unknown'}</span>
                  </div>
                </div>

                {/* Execution Time */}
                <div className="p-5 rounded-2xl bg-base-100/60 border border-base-content/10 backdrop-blur-md flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Exec Time</span>
                  <div className="flex items-center gap-2 font-mono text-base-content">
                    <Clock size={18} className="text-secondary" />
                    <span>{submission.executionTime ? `${submission.executionTime} ms` : 'N/A'}</span>
                  </div>
                </div>

                {/* Memory Used */}
                <div className="p-5 rounded-2xl bg-base-100/60 border border-base-content/10 backdrop-blur-md flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Memory</span>
                  <div className="flex items-center gap-2 font-mono text-base-content">
                    <Cpu size={18} className="text-accent" />
                    <span>{submission.memoryUsed ? `${submission.memoryUsed} KB` : 'N/A'}</span>
                  </div>
                </div>

                {/* Language */}
                <div className="p-5 rounded-2xl bg-base-100/60 border border-base-content/10 backdrop-blur-md flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Language</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-base-content">
                    <Terminal size={18} className="text-info" />
                    <span className="uppercase">{submission.language || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.problem && (
                  <Link 
                    to={`/problem/${submission.problem}`}
                    className="group flex items-center justify-between p-5 rounded-2xl bg-base-200/40 hover:bg-base-200/80 border border-base-content/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-base-100 shadow-sm border border-base-content/5 group-hover:scale-110 transition-transform">
                        <Archive size={20} className="text-base-content/70" />
                      </div>
                      <div>
                        <h3 className="text-base-content">View Problem</h3>
                        <p className="text-xs text-base-content/50 font-mono mt-0.5">Practice / Archive Mode</p>
                      </div>
                    </div>
                    <LinkIcon size={18} className="text-base-content/30 group-hover:text-primary transition-colors" />
                  </Link>
                )}

                {submission.assessment && (
                  <Link 
                    to={`/contest/${submission.assessment}`}
                    className="group flex items-center justify-between p-5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-base-100 shadow-sm border border-primary/10 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-primary">View Original Assessment</h3>
                        <p className="text-xs text-primary/60 font-mono mt-0.5">Live Contest Environment</p>
                      </div>
                    </div>
                    <LinkIcon size={18} className="text-primary/50 group-hover:text-primary transition-colors" />
                  </Link>
                )}
              </motion.div>

              <motion.div variants={ITEM_VARIANTS} className="w-full rounded-2xl overflow-hidden bg-secondary-content/50 border border-base-content/10 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-accent-content border-b border-primary/5">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-error/80" />
                    <div className="size-3 rounded-full bg-warning/80" />
                    <div className="size-3 rounded-full bg-success/80" />
                  </div>
                  <div className="font-mono text-xs text-accent tracking-wider absolute left-1/2 -translate-x-1/2">
                    solution.{submission.language === 'python' ? 'py' : submission.language === 'javascript' ? 'js' : 'cpp'}
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-secondary/70 hover:text-secondary text-xs font-mono transition-colors"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm leading-relaxed text-primary">
                    <code>{submission.code || '// No code submitted.'}</code>
                  </pre>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
});

SubmissionDetailPage.displayName = 'SubmissionDetailPage';
export default SubmissionDetailPage;