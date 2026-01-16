import React from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit3, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleCompletion, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group relative"
    >
      <div className={`
        flex items-center justify-between p-4 rounded-[20px] border transition-all duration-300
        ${task.completed
          ? 'bg-slate-900/40 border-white/5 opacity-75'
          : 'bg-white/5 border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.08] shadow-lg shadow-black/20'
        }
      `}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex items-center justify-center">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="h-5 w-5 rounded-md border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all duration-300"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <label
                htmlFor={`task-${task.id}`}
                className={`text-base font-bold tracking-tight transition-all duration-300 truncate cursor-pointer ${task.completed ? 'text-slate-500 line-through' : 'text-white'
                  }`}
              >
                {task.title}
              </label>
              {task.completed && (
                <div className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                  Done
                </div>
              )}
            </div>

            {task.description && (
              <p className={`text-xs ${task.completed ? 'text-slate-600' : 'text-slate-400'} font-medium line-clamp-1`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                <Calendar className="w-2.5 h-2.5 text-indigo-400" />
                <span>{new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                <Clock className="w-2.5 h-2.5 text-cyan-400" />
                <span>{new Date(task.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-3 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2.5 md:p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all active:scale-90"
            title="Edit task"
          >
            <Edit3 size={16} className="md:w-3.5 md:h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2.5 md:p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-90"
            title="Delete task"
          >
            <Trash2 size={16} className="md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;