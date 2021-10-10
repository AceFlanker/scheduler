import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (nextMode, replace = false) => {
    if (!replace) setHistory(prev => [nextMode, ...prev]);
    setMode(nextMode);
  };

  const back = () => {
    if (history.length === 1) return;
    setHistory(prev => prev.slice(1));
    setMode(history[1]);
  };

  // return { mode, transition, back };
  return [mode, transition, back];
}