import React, { useState, useEffect } from 'react';
import { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, AlignLeft, CheckCircle2, X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: TaskCreateInput | TaskUpdateInput) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCompleted(task.completed);
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Please provide a title for your task';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      completed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2 ml-1">
            <Type size={14} className="text-indigo-400" />
            TASK TITLE
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Design new landing page"
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
              transition-all duration-200 outline-none
              ${errors.title ? 'border-red-500/50 bg-red-500/5' : 'border-white/5'}
            `}
          />
          <AnimatePresence>
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-bold text-red-400 ml-1"
              >
                {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2 ml-1">
            <AlignLeft size={14} className="text-cyan-400" />
            DESCRIPTION (OPTIONAL)
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details about this task..."
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none resize-none"
          />
        </motion.div>

        {task && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all"
            onClick={() => setCompleted(!completed)}
          >
            <div className={`
              w-5 h-5 rounded-md border flex items-center justify-center transition-all
              ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'}
            `}>
              {completed && <CheckCircle2 size={14} />}
            </div>
            <span className={`text-sm font-bold ${completed ? 'text-emerald-400' : 'text-slate-400'}`}>
              Mark as completed
            </span>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 pt-4"
      >
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="flex-1 h-12 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-[2] h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border-0"
        >
          {task ? 'Update Changes' : 'Create Task'}
        </Button>
      </motion.div>
    </form>
  );
};