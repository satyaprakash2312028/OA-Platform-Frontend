import React, { useState, useEffect } from 'react';
import { getTimeDifference } from '../lib/utility.js';

// 1. Wrap in React.memo
// Prevents the timer from needlessly re-rendering if its parent component updates
const Timer = React.memo(({ endTime }) => {
    // 2. Consolidate State
    // Instead of 4 separate state allocations, use a single array.
    // This perfectly matches your getTimeDifference return signature and batches updates.
    const [timeLeft, setTimeLeft] = useState([0, 0, 0, 0]);

    useEffect(() => {
        if (!endTime) return;

        const updateTimer = () => {
            // Calculate the vector once and set it
            setTimeLeft(getTimeDifference(endTime - 1, new Date()));
        };

        // 3. Immediate Execution
        // Call it immediately to prevent an initial 1-second flash of "00:00:00"
        updateTimer();
        
        const intervalID = setInterval(updateTimer, 1000);
        
        return () => clearInterval(intervalID);
    }, [endTime]);

    // Destructure for clean markup
    const [second, minute, hours, days] = timeLeft;

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max p-16 w-fit rounded-xl space-x-6">
            {days > 0 && (
                <div className="flex flex-col">
                    <span className="countdown font-mono text-6xl">
                        {/* 4. Graceful Degradation & Accessibility */}
                        <span 
                            style={{ "--value": days, "--digits": 3 }} 
                            aria-live="polite" 
                            aria-label={`${days} days`}
                        >
                            {days}
                        </span>
                    </span>
                    days
                </div>
            )}
            
            <div className="flex flex-col">
                <span className="countdown font-mono text-6xl">
                    <span 
                        style={{ "--value": hours, "--digits": 2 }} 
                        aria-live="polite" 
                        aria-label={`${hours} hours`}
                    >
                        {hours}
                    </span>
                </span>
                hours
            </div>
            
            <div className="flex flex-col">
                <span className="countdown font-mono text-6xl">
                    <span 
                        style={{ "--value": minute, "--digits": 2 }} 
                        aria-live="polite" 
                        aria-label={`${minute} minutes`}
                    >
                        {minute}
                    </span>
                </span>
                min
            </div>
            
            <div className="flex flex-col">
                <span className="countdown font-mono text-6xl">
                    <span 
                        style={{ "--value": second, "--digits": 2 }} 
                        aria-live="polite" 
                        aria-label={`${second} seconds`}
                    >
                        {second}
                    </span>
                </span>
                sec
            </div>
        </div>
    );
});

Timer.displayName = 'Timer';

export default Timer;