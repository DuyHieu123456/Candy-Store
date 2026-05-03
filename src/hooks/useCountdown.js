// src/hooks/useCountdown.js
import { useState, useEffect } from "react";

const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = targetDate - new Date();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const timer = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return time;
};

export default useCountdown;