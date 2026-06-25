import React, { useEffect } from 'react';
import { Group, Panel, Separator } from "react-resizable-panels";
import { motion } from 'motion/react';
import ProblemStatement from '../ProblemStatement.jsx';
import WrapEditor from '../WrapEditor.jsx';
import { ChevronRight } from 'lucide-react';
import useEditorStore from '../../store/useEditorStore.js';
import toast from 'react-hot-toast';
import useNavStore from '../../store/useNavStore.js';

const ProblemDetailPage = React.memo(({ isAssessment }) => {
  // Granular State Selection
  const submitProblem = useEditorStore((state) => state.submitProblem);
  const assessmentId = useEditorStore((state) => state.assessmentId);
  const isSubmitting = useEditorStore((state) => state.isSubmitting);
  const cooldown = useEditorStore((state) => state.cooldown);
  const setAssessmentId = useEditorStore((state) => state.setAssessmentId);
  
  const setNavVisibility = useNavStore((state) => state.setNavVisibility);

  useEffect(() => {
    setNavVisibility(false);
    return () => {
      setAssessmentId(''); 
      setNavVisibility(true);
    };
  }, [setAssessmentId, setNavVisibility]);

  useEffect(() => {
    if (assessmentId === null && isAssessment) {
      toast.dismiss();
      toast.error("This problem is not part of any assessment.");
    }
  }, [assessmentId, isAssessment]);

  return (
    <div className="h-screen w-full overflow-hidden bg-base-100">
      {isAssessment && assessmentId && (
        <div className='fixed ml-3 mt-3 space-x-3 flex items-center justify-center z-0' title='Live Contest'>
          <span className="loading loading-ring loading-xl text-success" />
        </div>
      )}
      
      <Group direction="horizontal" className='h-full w-full'>
        {/* LEFT PANEL */}
        <Panel defaultSize={40} minSize={20}>
          <div className="h-full w-full overflow-y-auto custom-scrollbar overflow-auto [scrollbar-height:none]">
            <ProblemStatement />
          </div>
        </Panel>

        <Separator className='w-1 bg-base-300 z-10' />

        {/* RIGHT PANEL */}
        <Panel defaultSize={60} minSize={30}>
          <div className="h-fit w-full overflow-hidden flex flex-col">
            <WrapEditor />
          </div>
        </Panel>
      </Group>
      
      <motion.button 
        disabled={isSubmitting || cooldown}
        onClick={() => { if (!isAssessment) setAssessmentId(null); submitProblem(); }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        whileTap={{ scale: 0.90, transition: { duration: 0.1, type: 'tween' } }}
        className='z-50 btn btn-success fixed bottom-10 right-10 space-x-1 transition-color duration-400' 
      >
        <span className={(isSubmitting || cooldown) ? 'loading loading-spinner' : ''}>
          {(isSubmitting || cooldown) ? '' : 'Submit'}
        </span>
        <ChevronRight size={18} className={(isSubmitting || cooldown) ? 'hidden' : 'inline'} />
      </motion.button>
    </div>
  );
});

ProblemDetailPage.displayName = 'ProblemDetailPage';
export default ProblemDetailPage;