import React, { useState } from 'react';
import { Eye, Mail, Lock, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import useAuthStore from '../../store/useAuthStore';

const MotionMail = motion.create(Mail);
const MotionLock = motion.create(Lock);
const MotionEye = motion.create(Eye);
const MotionEyeOff = motion.create(EyeOff);

// Hoist Repeating Animations
const FADE_UP_ANIM = {
  initial: { opacity: 0.2, scale: 0.8, y: -35 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" } }
};

const LoginPage = React.memo(() => {
  // Granular Zustand
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-48 sm:mx-48 mx-5 h-fit">
      <motion.fieldset
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-16"
        {...FADE_UP_ANIM}
      >
        <motion.legend className="fieldset-legend text-sm" {...FADE_UP_ANIM}>
          Login
        </motion.legend>

        <motion.label
          className="mb-6 input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionMail size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input 
            type="email" 
            placeholder="mail@site.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-52 sm:w-60 transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
          />
        </motion.label>

        <motion.label
          className="mb-6 input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionLock size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input
            type={isPasswordVisible ? "text" : "password"}
            required
            placeholder={isPasswordVisible ? "Password" : "•••••••••••••••••"}
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            className={`w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0 ${(!isPasswordVisible && password !== "") ? "blur-xs" : ""}`}
          />
          <motion.button
            type='button'
            className='flex items-center justify-center h-fit'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, transition: { duration: 0.2, type: "tween" } }}
            onClick={(e) => { e.preventDefault(); setIsPasswordVisible(!isPasswordVisible); }}
          >
            <AnimatePresence mode="wait" initial={true}>
              {isPasswordVisible ? (
                <MotionEye key="visible" size={18} initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.15 }} />
              ) : (
                <MotionEyeOff key="hidden" size={18} initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.15 }} />
              )}
            </AnimatePresence>
          </motion.button>
        </motion.label>

        <motion.button
          disabled={isLoggingIn}
          type='submit'
          className="btn btn-primary mt-4 w-full shadow-none"
          {...FADE_UP_ANIM}
          whileHover={{ scale: 1.05, transition: { duration: 0.2, type: "tween" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          {!isLoggingIn ? 'Login' : <><Loader2 size={18} className="animate-spin" />Loading...</>}
        </motion.button>
      </motion.fieldset>
    </form>
  );
});

LoginPage.displayName = 'LoginPage';
export default LoginPage;