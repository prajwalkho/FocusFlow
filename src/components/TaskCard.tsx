import React from 'react';
import { Task } from '../types';
import { Calendar, Flag, CheckCircle2, Circle, Trash2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const priorityColors = {
    High: 'text-rose-600 bg-rose-50',
    Medium: 'text-amber-600 bg-amber-50',
    Low: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <div className={clsx(
      "bg-white rounded-xl border p-4 transition-all hover:shadow-md",
      task.status === 'Completed' ? "opacity-60 border-gray-100" : "border-gray-200"
    )}>
      <div className="flex items-start justify-between gap-3">
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.status === 'Completed' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 hover:text-emerald-400 transition-colors" />
          )}
        </button>
        
        <div className="flex-grow min-w-0">
          <h3 className={clsx(
            "text-sm font-semibold truncate",
            task.status === 'Completed' ? "line-through text-gray-400" : "text-gray-900"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1", priorityColors[task.priority])}>
              <Flag className="w-3 h-3" />
              {task.priority}
            </span>
            
            {task.deadline && (
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(task.deadline), 'MMM d, yyyy')}
              </span>
            )}
            
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {task.category}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-rose-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
