import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, Database, Cpu, Layers, Activity, 
  ShieldAlert, Users, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Hoist Animation Configurations
const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const TITLE_BG_ANIM = { 
  backgroundPosition: ["0% 100%", "100% 100%", "100% 0%", '100% 100%', '0% 100%'] 
};

const TITLE_BG_TRANSITION = { 
  duration: 9, 
  repeat: Infinity, 
  ease: "linear" 
};

const HomePage = React.memo(() => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-base-content overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <motion.div 
        className="max-w-7xl mx-auto text-center mt-16 md:mt-24 mb-32"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 , type: 'spring'}}
      >
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-base-200/50 border border-base-300 backdrop-blur-md mb-8 shadow-sm">
          <Activity className="size-4 text-success animate-pulse" />
          <span className="text-sm font-bold tracking-widest uppercase text-base-content/80">
            Version 1.0 • Production Ready
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
          A Distributed Engine for <br/>
          <motion.span 
            animate={TITLE_BG_ANIM}
            transition={TITLE_BG_TRANSITION}
            className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_auto]"
          >
            Algorithmic Excellence.
          </motion.span>
        </h1>
        
        <p className="text-lg md:text-2xl text-base-content/70 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
          Culminating months of rigorous engineering. Codephilia is an enterprise-grade Online Judge built on asynchronous BullMQ workers, Dockerized isolation, and O(1) Redis architectures.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/problemset" className="btn btn-primary btn-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto h-16 px-12 text-lg">
            Enter Platform
          </Link>
          <a href="#architecture" className="btn btn-outline btn-lg hover:scale-105 transition-all w-full sm:w-auto h-16 px-12 text-lg group">
            View Architecture <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>

      {/* --- CORE ARCHITECTURE DEEP DIVE --- */}
      <div id="architecture" className="max-w-7xl mx-auto mb-32 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">System Architecture</h2>
          <p className="text-xl text-base-content/60 max-w-3xl mx-auto font-light">
            Designed to bypass the limitations of single-threaded Node.js environments when handling high-compute algorithmic evaluations.
          </p>
        </motion.div>

        <motion.div 
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={FADE_UP} className="card bg-base-100/50 backdrop-blur-xs border border-base-200 shadow-xl hover:border-primary/50 transition-colors group duration-300">
            <div className="card-body">
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Layers className="size-8 text-primary" />
              </div>
              <h3 className="card-title text-2xl mb-3 font-normal">BullMQ Queue Processing</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Heavy code compilation tasks are offloaded from the main event loop. BullMQ manages submission jobs, ensuring robust retry mechanisms, rate limiting, and highly available async worker controllers.
              </p>
            </div>
          </motion.div>

          <motion.div variants={FADE_UP} className="card bg-base-100/50 backdrop-blur-xs border border-base-200 shadow-xl hover:border-secondary/50 transition-colors group duration-300">
            <div className="card-body">
              <div className="p-4 bg-secondary/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Database className="size-8 text-secondary" />
              </div>
              <h3 className="card-title text-2xl mb-3 font-normal">O(1) Redis Operations</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Live contest leaderboards are powered by Redis Sorted Sets (ZSETs). Complex state shifts and caching updates are handled securely via custom Lua scripts to guarantee absolute atomicity.
              </p>
            </div>
          </motion.div>

          <motion.div variants={FADE_UP} className="card bg-base-100/50 backdrop-blur-xs border border-base-200 shadow-xl hover:border-error/50 transition-colors group duration-300">
            <div className="card-body">
              <div className="p-4 bg-error/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="size-8 text-error" />
              </div>
              <h3 className="card-title text-2xl mb-3 font-normal">Isolated Sandboxing</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Zero cross-contamination. User code is evaluated inside deeply restricted Docker containers. Dedicated timeout wrappers strictly enforce execution limits and catch memory exhaustion attempts.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- THE ASSESSMENT ENGINE --- */}
      <motion.div 
        className="max-w-7xl mx-auto mb-32 bg-base-200/40 rounded-[2rem] border border-base-300 overflow-hidden shadow-2xl backdrop-blur-xs"
        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-accent font-bold tracking-wider mb-6 text-sm uppercase">
              <Cpu className="size-5" /> Evaluation Models
            </div>
            <h2 className="text-4xl font-semibold mb-6 ">Comprehensive Contest Engine</h2>
            <p className="text-lg text-base-content/70 mb-8 leading-relaxed font-light">
              The platform moves beyond standard coding problems. It features a deeply integrated schema structure designed for institutional and competitive evaluations.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="size-6 text-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lg">Team-Based Synchronization</span>
                  <p className="text-base-content/60 text-sm mt-1">Unified evaluation metrics linking multiple users via dedicated Team Data Models.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="size-6 text-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lg">Hybrid Question Formats</span>
                  <p className="text-base-content/60 text-sm mt-1">Seamlessly blending standard algorithmic coding questions with structured Team based assessments.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="size-6 text-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lg">Real-Time Socket Verdicts</span>
                  <p className="text-base-content/60 text-sm mt-1">Live WebSockets push instant evaluation updates back to the UI, eliminating expensive HTTP polling.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#0D1117] p-8 lg:p-12 relative border-l border-base-300/20">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="size-3 rounded-full bg-error/80"></div>
              <div className="size-3 rounded-full bg-warning/80"></div>
              <div className="size-3 rounded-full bg-success/80"></div>
            </div>
            <div className="mt-6 font-mono text-sm leading-loose">
              <p className="text-blue-400">import <span className="text-white">{' { Worker } '}</span>from <span className="text-green-400">'bullmq'</span>;</p>
              <p className="text-blue-400">import <span className="text-white">redisCache</span> from <span className="text-green-400">'../utilities/redis_cache.js'</span>;</p>
              <br/>
              <p className="text-gray-500 italic">// Initialize asynchronous worker controller</p>
              <p className="text-purple-400">const <span className="text-white">submissionWorker</span> = <span className="text-blue-400">new</span> Worker(</p>
              <p className="text-green-400 ml-4">'CodeExecutionQueue',</p>
              <p className="text-blue-400 ml-4">async <span className="text-white">(job)</span> =&gt; {'{'}</p>
              <p className="text-purple-400 ml-8">const <span className="text-white">result</span> = <span className="text-blue-400">await</span> executeInDocker(job.data);</p>
              <p className="text-gray-500 italic ml-8">// O(1) Atomic update via Lua</p>
              <p className="text-blue-400 ml-8">await <span className="text-white">redisCache.updateLeaderboard(</span>result.score<span className="text-white">);</span></p>
              <p className="text-blue-400 ml-8">socketIo.to(job.data.userId).emit(<span className="text-green-400">'verdict'</span>, result);</p>
              <p className="text-white ml-4">{'}'},</p>
              <p className="text-white ml-4">{'{'} <span className="text-blue-400">connection</span>: redisOptions {'}'}</p>
              <p className="text-white">);</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- FRONTEND METRICS --- */}
      <motion.div 
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold mb-10 flex items-center justify-center gap-3">
          <Terminal className="size-8 text-primary" /> Frontend Engineering
        </h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow-2xl w-full bg-base-100/80 backdrop-blur-md border border-base-200">
          <div className="stat place-items-center py-8 hover:bg-base-200/50 transition-colors">
            <div className="stat-title text-base-content/70">State Management</div>
            <div className="stat-value text-primary mt-2 mb-1 font-bold">Zustand</div>
            <div className="stat-desc font-medium">Modular global hooks</div>
          </div>
          <div className="stat place-items-center py-8 border-t lg:border-t-0 lg:border-l border-base-300 hover:bg-base-200/50 transition-colors">
            <div className="stat-title text-base-content/70">UI Framework</div>
            <div className="stat-value text-secondary mt-2 mb-1 font-bold">DaisyUI</div>
            <div className="stat-desc font-medium">30+ Dynamic Themes</div>
          </div>
          <div className="stat place-items-center py-8 border-t lg:border-t-0 lg:border-l border-base-300 hover:bg-base-200/50 transition-colors">
            <div className="stat-title text-base-content/70">Animations</div>
            <div className="stat-value text-accent mt-2 mb-1 font-bold">Framer</div>
            <div className="stat-desc font-medium">Hardware accelerated</div>
          </div>
        </div>
      </motion.div>

    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;