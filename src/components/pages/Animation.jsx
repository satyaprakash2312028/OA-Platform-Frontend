import React from 'react';
import { motion } from 'motion/react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-base-100 flex items-center justify-center">
      
      {/* 1. THE ALGORITHMIC GRID 
          Uses base-content (text color) so it automatically flips dark/light 
          depending on the active DaisyUI theme. Pure CSS animation = 0 GPU strain. 
      */}
      <div 
        className="absolute inset-0 text-base-content opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          animation: 'panGrid 20s linear infinite',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 10%, transparent 80%)'
        }}
      />

      {/* 2. ORBITAL RINGS 
          Sharp, highly visible dashed borders moving infinitely in the background.
      */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-25%] right-[-15%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] border-[2px] border-dashed border-primary/30 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[5%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] border-[1px] border-secondary/40 rounded-full"
      />
      
      {/* 3. FLOATING GRAPH NODES (Glassmorphism)
          Clearly visible elements that represent active data nodes or workers.
      */}
      
      {/* Primary Node */}
      <motion.div
        animate={{ y: [0, -40, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] left-[10%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent border border-primary/50 flex items-center justify-center shadow-lg shadow-primary/20"
      >
         <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
      </motion.div>

      {/* Secondary Node */}
      <motion.div
        animate={{ y: [0, 50, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[20%] right-[15%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/50 flex items-center justify-center shadow-lg shadow-secondary/20"
      >
         <div className="w-4 h-4 rounded-full bg-secondary/80 animate-pulse" />
      </motion.div>

      {/* Accent Node */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-[40%] right-[30%] w-12 h-12 md:w-16 md:h-16 rounded-full border border-accent/60 bg-accent/20 flex items-center justify-center"
      >
         <div className="w-2 h-2 rounded-full bg-accent" />
      </motion.div>

      {/* 4. STATIC GLOW 
          A single, non-moving glow in the center to tie the colors together.
          Because it doesn't move, the browser paints it once. No lag.
      */}
      

      {/* CSS KEYFRAMES */}
      <style>{`
        @keyframes panGrid {
          0% { background-position: 0px 0px; }
          100% { background-position: 4rem 4rem; }
        }
      `}</style>
    </div>
  );
};

export default BackgroundAnimation;