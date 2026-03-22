import React from 'react';
import { PomodoroTimer } from '../components/PomodoroTimer';

export const PomodoroPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Focus Timer</h1>
        <p className="text-gray-500 mt-2">Use the Pomodoro technique to maximize your productivity.</p>
      </header>
      
      <PomodoroTimer />
      
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <p className="text-sm font-medium text-gray-900">Choose a task</p>
            <p className="text-xs text-gray-500 leading-relaxed">Pick one task from your list to focus on exclusively during this session.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <p className="text-sm font-medium text-gray-900">Work for 25 mins</p>
            <p className="text-xs text-gray-500 leading-relaxed">Avoid all distractions. If one pops up, write it down and get back to work.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <p className="text-sm font-medium text-gray-900">Take a short break</p>
            <p className="text-xs text-gray-500 leading-relaxed">Step away from your desk. Stretch, grab water, or just close your eyes.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">4</div>
            <p className="text-sm font-medium text-gray-900">Repeat 4 times</p>
            <p className="text-xs text-gray-500 leading-relaxed">After 4 focus sessions, take a longer 15-30 minute break to recharge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
