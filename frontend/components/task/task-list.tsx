import React from 'react';
import { Task } from '@/types/task';
import TaskItem from '@/components/ui/task-item';
import { WithLoading } from '@/lib/utils/loading-error-utils';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddNewTask: () => void;
}

const TaskSkeleton = () => (
  <div className="grid gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-white/10 rounded-full w-48" />
            <div className="h-3 bg-white/5 rounded-full w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-white/5 rounded-lg" />
          <div className="w-8 h-8 bg-white/5 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onRetry,
  onToggleCompletion,
  onEdit,
  onDelete,
  onAddNewTask,
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12 px-6 py-10 glass border-red-500/20 text-center rounded-[2.5rem]"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Sync Failed</h3>
        <p className="text-slate-400 font-medium mb-8 max-w-xs mx-auto">
          {error || "We couldn't load your tasks. Please check your connection and try again."}
        </p>
        <Button
          onClick={onRetry}
          className="bg-white/5 hover:bg-white/10 text-white rounded-xl px-8 h-12 flex items-center gap-2 mx-auto border border-white/5 active:scale-95 transition-all font-bold"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <WithLoading loading={loading} error={error} onRetry={onRetry} skeleton={<TaskSkeleton />}>
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 glass bg-white/[0.02] border-dashed border-white/5"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center border border-white/5">
                <ListTodo size={40} className="text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No tasks found</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">
              Your workspace is clear! Start organizing your day by creating your first task.
            </p>
            <Button
              onClick={onAddNewTask}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 mx-auto border-0"
            >
              <Plus size={22} />
              Create your first task
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleCompletion={onToggleCompletion}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </WithLoading>
    </div>
  );
};

export default TaskList;