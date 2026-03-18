import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'

import useAuthStore from '../../store/useAuthStore'
import useSocketStore from '../../store/useSocketStore'
import axiosInstance from '../../lib/axios'
import toast from 'react-hot-toast'

const languageOptions = [
  { label: 'JavaScript', value: 'javascript', ext: javascript() },
  { label: 'Python', value: 'python', ext: python() },
  { label: 'C++', value: 'cpp', ext: null },
  { label: 'Java', value: 'java', ext: java() },
  { label: 'C', value: 'c', ext: null }
];

const starterTemplate = {
  javascript: `// JavaScript template\nfunction main(){\n  console.log('Hello World');\n}\n`,
  python: `# Python template\ndef main():\n    print('Hello World')\n`,
  cpp: `// C++ template\n#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    cout<<"Hello World"<<"\n";\n    return 0;\n}\n`,
  java: `// Java template\npublic class Main{\n    public static void main(String[] args){\n        System.out.println("Hello World");\n    }\n}\n`
}

const SubmitProblemPage = () => {
  const { problemId: paramProblemId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { createPendingToast } = useSocketStore();

  const [providedProblemId, setProvidedProblemId] = useState(paramProblemId || '');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeMap, setCodeMap] = useState({ javascript: starterTemplate.javascript, python: starterTemplate.python, cpp: starterTemplate.cpp, java: starterTemplate.java });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(()=>{
    if (!authUser) {
      navigate('/', { replace: true });
    }
  }, [authUser, navigate]);

  const onChangeCode = useCallback((value) => {
    setCodeMap((m)=>({ ...m, [selectedLanguage === 'c' ? 'cpp': selectedLanguage]: value }));
  }, [selectedLanguage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problemId = paramProblemId || providedProblemId.trim();
    if (!problemId) return toast.error('Problem ID is required');
    const languageToSend = selectedLanguage === 'c' ? 'cpp' : selectedLanguage;
    const code = codeMap[selectedLanguage === 'c' ? 'cpp' : selectedLanguage] || '';
    if (!code.trim()) return toast.error('Code cannot be empty');

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post(`/problem/submitProblem/${problemId}`, { code, language: languageToSend });
      const submissionId = res.data.submissionId;
      // create initial pending toast (3s) and map it
      createPendingToast(submissionId, 'Pending');
      toast.success('Submission received');
      navigate('/dashboard/submissions/page/1');
    } catch (error) {
      console.error('Submit error', error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || error?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-8 mt-28 w-full">
      <div className="fieldset bg-base-200/60 backdrop-blur-md border-none rounded-box w-full p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-semibold">Submit Problem</h2>

        {!paramProblemId && (
          <div className="mt-4">
            <label className="label text-sm">Problem ID</label>
            <input value={providedProblemId} onChange={(e)=>setProvidedProblemId(e.target.value)} className="input w-full bg-base-300" placeholder="Enter problem ID" />
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm opacity-70">Language</label>
          <select value={selectedLanguage} onChange={(e)=>setSelectedLanguage(e.target.value)} className="select select-sm">
            {languageOptions.map((l)=> <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div className="mt-4 editor-wrapper">
          <CodeMirror
            value={codeMap[selectedLanguage === 'c' ? 'cpp': selectedLanguage]}
            extensions={languageOptions.find(l => l.value === selectedLanguage)?.ext ? [languageOptions.find(l => l.value === selectedLanguage).ext] : []}
            onChange={(value) => onChangeCode(value)}
            height="400px"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button disabled={isSubmitting} onClick={handleSubmit} className="btn btn-primary">{isSubmitting? 'Submitting...':'Submit'}</button>
          <button onClick={()=>{ setCodeMap((m)=>({ ...m, [selectedLanguage==='c'?'cpp':selectedLanguage]: '' })) }} className="btn btn-ghost">Clear</button>
        </div>
      </div>
    </div>
  )
}

export default SubmitProblemPage
