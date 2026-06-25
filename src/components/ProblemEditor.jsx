import React, { useState, useDeferredValue, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// 1. Hoist Constants & Plugins
// Prevents ReactMarkdown from rebuilding its parser pipeline on every render
const REMARK_PLUGINS = [remarkMath];
const REHYPE_PLUGINS = [rehypeKatex];

const DEFAULT_CONTENT = `# Two Sum\n\nGiven an array of integers $nums$ and an integer $target$, return indices of the two numbers such that they add up to $target$.\n\n**Constraints:**\n* $2 \\le nums.length \\le 10^4$\n* $-10^9 \\le nums[i] \\le 10^9$\n\n**Example:**\n$$\nInput: nums = [2,7,11,15], target = 9 \\\\\nOutput: [0,1]\n$$`;

// 2. Isolate the Expensive Component
// React.memo ensures this only re-renders when the deferred content actually changes
const MarkdownPreview = React.memo(({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
        >
            {content}
        </ReactMarkdown>
    );
});

MarkdownPreview.displayName = 'MarkdownPreview';

const ProblemEditor = React.memo(() => {
    const [markdown, setMarkdown] = useState(DEFAULT_CONTENT);
    
    // 3. Concurrent Rendering (The Magic Bullet)
    // This tells React: "Update the textarea state immediately so typing is smooth, 
    // but process this deferred value in the background when the main thread is idle."
    const deferredMarkdown = useDeferredValue(markdown);

    const handleChange = useCallback((e) => {
        setMarkdown(e.target.value);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Create Problem Statement</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
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
                        onChange={handleChange}
                        placeholder="Type your problem statement here..."
                        spellCheck="false"
                    />
                </div>

                {/* Right Pane: Preview (Exact Render) */}
                <div className="w-1/2 flex flex-col bg-white">
                    <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                        Live Preview
                    </div>
                    
                    <div className="flex-1 p-6 overflow-y-auto prose prose-blue max-w-none">
                        {/* We pass the deferred value to the memoized previewer */}
                        <MarkdownPreview content={deferredMarkdown} />
                    </div>
                </div>
            </div>
        </div>
    );
});

ProblemEditor.displayName = 'ProblemEditor';

export default ProblemEditor;