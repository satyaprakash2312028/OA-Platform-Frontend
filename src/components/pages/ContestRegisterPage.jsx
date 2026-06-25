import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import toast from 'react-hot-toast';
import { IdCardLanyardIcon, FileKey, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const MotionIdCardLanyard = motion.create(IdCardLanyardIcon);
const MotionFileKey = motion.create(FileKey);

// 1. Hoist Repeating Animations
const FADE_UP_ANIM = {
  initial: { opacity: 0.2, scale: 0.8, y: -35 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" } }
};

const ContestRegisterPage = React.memo(() => {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [existingTeamID, setExistingTeamID] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!contestId) {
      toast.error('Contest ID is missing');
      navigate('/contests/page/1');
    }
  }, [contestId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim() && !existingTeamID.trim()) {
      toast.dismiss();
      toast.error('Please enter a team name or existing team ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        teamName: teamName.trim() !== '' ? teamName.trim() : null,
        assessmentId: contestId,
        existingTeamID: existingTeamID.trim() || null,
      };
      
      const res = await axiosInstance.post('/registration/register', payload);
      
      toast.dismiss();
      toast.success(`Registered successfully\nTeam ID: ${res.data.team}\n(Team ID copied to clipboard)`);
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(res.data.team);
      }
      
      setTimeout(() => {
        navigate(`/contest/${contestId}`);
      }, 1500);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      toast.dismiss();
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-48 sm:mx-48 mx-5 h-fit">
      <motion.fieldset
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-16"
        {...FADE_UP_ANIM}
      >
        <motion.legend className="fieldset-legend text-sm" {...FADE_UP_ANIM}>
          Register
        </motion.legend>

        <motion.label
          className="mb-6 input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionIdCardLanyard size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input 
            type="text" 
            placeholder="Team Name" 
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className='w-52 sm:w-60 transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
          />
        </motion.label>

        <motion.label
          className="mb-6 input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionFileKey size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input
            type="text"
            placeholder="Existing Team ID (optional)"
            minLength="8"
            value={existingTeamID}
            onChange={(e) => setExistingTeamID(e.target.value)}
            className='w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0'
          />
        </motion.label>

        <motion.button
          disabled={isSubmitting}
          type='submit'
          className="btn btn-primary mt-4 w-full shadow-none"
          {...FADE_UP_ANIM}
          whileHover={{ scale: 1.05, transition: { duration: 0.2, type: "tween" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          {!isSubmitting ? 'Register' : <><Loader2 size={18} className="animate-spin" />Loading...</>}
        </motion.button>
      </motion.fieldset>
    </form>
  );
});

ContestRegisterPage.displayName = 'ContestRegisterPage';
export default ContestRegisterPage;