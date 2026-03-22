import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { POMODORO_WORK_TIME, POMODORO_SHORT_BREAK } from '../constants';
import { useAuth } from '../context/AuthContext';

export const PomodoroTimer: React.FC = () => {
  const { token } = useAuth();
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (mode === 'work') {
      // Log productivity
      try {
        await fetch('/api/productivity/log-focus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ minutes: 25 })
        });
      } catch (err) {
        console.error(err);
      }
      setMode('break');
      setTimeLeft(POMODORO_SHORT_BREAK);
    } else {
      setMode('work');
      setTimeLeft(POMODORO_WORK_TIME);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? POMODORO_WORK_TIME : POMODORO_SHORT_BREAK);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setMode('work'); setTimeLeft(POMODORO_WORK_TIME); setIsActive(false); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'work' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); setTimeLeft(POMODORO_SHORT_BREAK); setIsActive(false); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'break' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Coffee className="w-4 h-4 inline mr-2" />
          Break
        </button>
      </div>

      <div className="text-8xl font-black text-gray-900 mb-8 font-mono tracking-tighter">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-400 font-medium uppercase tracking-widest">
        {mode === 'work' ? 'Time to focus' : 'Take a breather'}
      </p>
    </div>
  );
};
