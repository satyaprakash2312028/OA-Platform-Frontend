import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // CRITICAL: Don't forget this import!

const ProblemEditor = () => {
  // Default text to show the admin examples of what works
  const defaultContent = `# Two Sum

Given an array of integers $nums$ and an integer $target$, return indices of the two numbers such that they add up to $target$.

**Constraints:**
* $2 \\le nums.length \\le 10^4$
* $-10^9 \\le nums[i] \\le 10^9$

**Example:**
$$
Input: nums = [2,7,11,15], target = 9 \\\\
Output: [0,1]
$$
`;

  const [markdown, setMarkdown] = useState(defaultContent);
  useEffect(()=>{
    console.log({markdown})
  }, [markdown]);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Create Problem Statement</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Problem
        </button>
      </div>

      {/* Editor Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Write (Textarea) */}
        <div className="w-1/2 flex flex-col border-r border-gray-300 bg-white">
          <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
            Editor (Markdown + LaTeX)
          </div>
          <textarea
            className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            value={markdown}
            onChange={(e) => {setMarkdown(e.target.value);}}
            placeholder="Type your problem statement here..."
            spellCheck="false"
          />
        </div>

        {/* Right Pane: Preview (Exact Render) */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
            Live Preview
          </div>
          
          {/* NOTE: 'prose' comes from @tailwindcss/typography plugin. 
             It automatically styles headings, lists, and paragraphs nicely.
             If you don't have it, just remove 'prose prose-blue' and style manually.
          */}
          <div className="flex-1 p-6 overflow-y-auto prose prose-blue max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemEditor;