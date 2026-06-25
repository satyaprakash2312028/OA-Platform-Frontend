import React from 'react';
import { motion } from 'motion/react';

// 1. Hoisted Animation Definitions
const ORBIT_1 = { rotate: 360 };
const ORBIT_1_TRANS = { duration: 60, repeat: Infinity, ease: "linear" };

const ORBIT_2 = { rotate: -360 };
const ORBIT_2_TRANS = { duration: 90, repeat: Infinity, ease: "linear" };

const NODE_1 = { y: [0, -40, 0], opacity: [0.6, 1, 0.6] };
const NODE_1_TRANS = { duration: 7, repeat: Infinity, ease: "easeInOut" };

const NODE_2 = { y: [0, 50, 0], opacity: [0.5, 0.9, 0.5] };
const NODE_2_TRANS = { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 };

const NODE_3 = { y: [0, -20, 0], scale: [1, 1.15, 1] };
const NODE_3_TRANS = { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 };

const BackgroundAnimation = React.memo(() => {
  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-base-100 flex items-center justify-center">
      
      {/* 1. THE ALGORITHMIC GRID */}
      <div 
        className="absolute inset-0 text-base-content opacity-[0.2]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          animation: 'panGrid 20s linear infinite',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 10%, transparent 80%)'
        }}
      />

      {/* 2. ORBITAL RINGS */}
      <motion.div 
        animate={ORBIT_1} transition={ORBIT_1_TRANS}
        className="absolute top-[-25%] right-[-15%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] border-[2px] border-dashed border-primary/60 rounded-full"
      />
      <motion.div 
        animate={ORBIT_2} transition={ORBIT_2_TRANS}
        className="absolute top-[-10%] right-[5%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] border-[1px] border-secondary/40 rounded-full"
      />
      <motion.div 
        animate={ORBIT_1} transition={ORBIT_1_TRANS}
        className="absolute top-[25%] left-[-15%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] border-[2px] border-dashed border-accent/50 rounded-full"
      />
      <motion.div 
        animate={ORBIT_2} transition={ORBIT_2_TRANS}
        className="absolute top-[30%] left-[5%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] border-[1px] border-secondary/40 rounded-full"
      />

      {/* 3. FLOATING GRAPH NODES */}
      <motion.div
        animate={NODE_1} transition={NODE_1_TRANS}
        className="absolute top-[25%] left-[10%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent border border-primary/50 flex items-center justify-center shadow-lg shadow-primary/20"
      >
         <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
      </motion.div>

      <motion.div
        animate={NODE_2} transition={NODE_2_TRANS}
        className="absolute bottom-[20%] right-[15%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/50 flex items-center justify-center shadow-lg shadow-secondary/20"
      >
         <div className="w-4 h-4 rounded-full bg-secondary/80 animate-pulse" />
      </motion.div>

      <motion.div
        animate={NODE_3} transition={NODE_3_TRANS}
        className="absolute top-[40%] right-[30%] w-12 h-12 md:w-16 md:h-16 rounded-full border border-accent/60 bg-accent/20 flex items-center justify-center"
      >
         <div className="w-2 h-2 rounded-full bg-accent" />
      </motion.div>

      <style>{` 
        @keyframes panGrid {
          0% { background-position: 0px 0px; }
          100% { background-position: 4rem 4rem; }
        }
      `}</style>
    </div>
  );
});

BackgroundAnimation.displayName = 'BackgroundAnimation';
export default BackgroundAnimation;