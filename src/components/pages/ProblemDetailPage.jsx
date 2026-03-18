import React, { useEffect } from 'react';
import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels";
import { motion } from 'motion/react';
import ProblemStatement from '../ProblemStatement.jsx';// Adjust path if needed
import WrapEditor from '../WrapEditor.jsx';
import { GripVertical, ChevronRight } from 'lucide-react'; // Optional: for a nice drag handle icon
import useEditorStore from '../../store/useEditorStore.js';
import toast from 'react-hot-toast';
import useNavStore from '../../store/useNavStore.js';

const ProblemDetailPage = ({ isAssessment }) => {
  const {submitProblem, assessmentId, isSubmitting, cooldown, setAssessmentId } = useEditorStore();
  const { setNavVisibility } = useNavStore();
  useEffect(() => {
    setNavVisibility(false);
    return () => {setAssessmentId(null); setNavVisibility(true);};
  },[setAssessmentId, setNavVisibility])
  useEffect(() => {
    console.log("Assessment ID in ProblemDetailPage:", isAssessment);
    if(assessmentId===null&&isAssessment){
      toast.dismiss();
      toast.error("This problem is not part of any assessment.");
    }
  }, [assessmentId]);
  return (
    <div className="h-screen w-full overflow-hidden bg-base-100 ">
      {/* NOTE: h-[calc(100vh-64px)] assumes you have a navbar of ~64px height. 
        If no navbar, use h-screen.
      */}
      {isAssessment&&assessmentId&&(<div className='fixed ml-3 mt-3 space-x-3 flex items-center justify-center z-0' title='Live Contest'>
        <span className="loading loading-ring loading-xl text-success" />
      </div>)}
      <Group direction="horizontal" className='h-full w-full'>

        {/* --- LEFT PANEL: Problem Statement --- */}
        <Panel defaultSize={40} minSize={20}>
          {/* We need a container with 'overflow-y-auto' here so the 
            problem statement scrolls independently of the editor.
          */}
          <div className="h-full w-full overflow-y-auto custom-scrollbar overflow-auto [scrollbar-height:none]">
            <ProblemStatement />
          </div>
        </Panel>

        {/* --- RESIZE HANDLE --- */}
        <Separator className='w-1 bg-base-300 z-10' />

        {/* --- RIGHT PANEL: Editor --- */}
        <Panel defaultSize={60} minSize={30}>
          <div className="h-fit w-full overflow-hidden flex flex-col">
            <WrapEditor />
          </div>
        </Panel>

      </Group>
      <motion.button 
      disabled={isSubmitting || cooldown}
      onClick={() => {if(!isAssessment) setAssessmentId(null); submitProblem();}}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      whileTap={{scale:0.90, transition:{duration:0.1, type:'tween'} }}
      className='z-50 btn btn-success fixed bottom-10 right-10 space-x-1 transition-color duration-400' >
            <span className={(isSubmitting||cooldown)?'loading loading-spinner': ''}>{(isSubmitting||cooldown)?'':'Submit'}</span><ChevronRight size={18} className={(isSubmitting||cooldown)?'hidden':'inline'}/>
      </motion.button>
    </div>
  );
};

export default ProblemDetailPage;