import React, {useState, useEffect} from 'react'
import { getTimeDifference, parseTimeVector } from '../lib/utility.js';

const Timer = ({endTime}) => {
    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);
    const [hours, setHours] = useState(0);
    const [days, setDays] = useState(0);

    useEffect(()=>{
        let intervalID;
        const func = () => {
            const vec = getTimeDifference(endTime-1 , new Date());
            setSecond(vec[0]);
            setMinute(vec[1]);
            setHours(vec[2]);
            setDays(vec[3]);
        }
        func();
        intervalID = setInterval(func,1000);
        return () => {clearInterval(intervalID)};
    }, [endTime]);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max p-16 w-fit rounded-xl space-x-6">
  {days>0&&(<div className="flex flex-col">
    <span className="countdown font-mono text-6xl">
      <span style={{"--value":days, "--digits":3} /* as React.CSSProperties */ } aria-live="polite" aria-label={days}>15</span>
    </span>
    days
  </div>)}
  <div className="flex flex-col">
    <span className="countdown font-mono text-6xl">
      <span style={{"--value":hours, "--digits":2} /* as React.CSSProperties */ } aria-live="polite" aria-label={hours}>10</span>
    </span>
    hours
  </div>
  <div className="flex flex-col">
    <span className="countdown font-mono text-6xl">
      <span style={{"--value":minute, "--digits":2} /* as React.CSSProperties */ } aria-live="polite" aria-label={minute}>24</span>
    </span>
    min
  </div>
  <div className="flex flex-col">
    <span className="countdown font-mono text-6xl">
      <span style={{"--value":second, "--digits":2} /* as React.CSSProperties */ } aria-live="polite" aria-label={second}>59</span>
    </span>
    sec
  </div>
</div>
  )
}

export default Timer