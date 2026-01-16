'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/layout/protected-route';
import TaskList from '@/components/task/task-list';
import { taskService } from '@/lib/api/task-service';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/task/task-form';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent } from '@/components/ui/card-enhanced';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Plus,
  Search,
  Bell,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLoadingError } from '@/lib/utils/loading-error-utils';
import AppLayout from '@/components/layout/app-layout';
import { HoverEffect, BounceIn, StaggeredList, StaggeredItem, FadeIn, SlideIn } from '@/components/reactbits-animated';

const TasksPage: React.FC = () => {
  const { loading, error, executeWithHandling } = useLoadingError();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await executeWithHandling(taskService.getAllTasks());
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      }
    } catch (err) { }
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      let updatedTask: any;
      if (editingTask) {
        updatedTask = await executeWithHandling(taskService.updateTask(editingTask.id, taskData));
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        updatedTask = await executeWithHandling(taskService.createTask(taskData));
        setTasks([updatedTask, ...tasks]);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) { }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      const updatedTask = await executeWithHandling(taskService.toggleTaskCompletion(taskId));
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) { }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await executeWithHandling(taskService.deleteTask(taskId));
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) { }
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Filter tasks based on search and selected filter
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    if (filter === 'all') return matchesSearch;
    if (filter === 'completed') return matchesSearch && task.completed;
    if (filter === 'pending') return matchesSearch && !task.completed;

    return matchesSearch;
  });

  return (
    <ProtectedRoute fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <p className="text-slate-400 font-medium tracking-tight">Accessing workspace...</p>
      </div>
    }>
      <AppLayout>
        <BounceIn>
          <div className="space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <FadeIn>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-2">My Tasks</h2>
                  <p className="text-slate-400 font-medium">You have {pendingCount} active tasks.</p>
                </FadeIn>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden lg:block group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/50 rounded-xl text-sm transition-all focus:w-64 outline-none text-white placeholder-slate-500"
                  />
                </div>
                <HoverEffect>
                  <Button
                    onClick={handleAddNewTask}
                    className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl px-6 h-12 shadow-xl shadow-indigo-600/20 flex items-center gap-2 group border-0 text-sm font-bold"
                  >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    New Task
                  </Button>
                </HoverEffect>
              </div>
            </header>

            {/* Stats */}
            <StaggeredList className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StaggeredItem className="h-full">
                <StatsCard
                  title="Total Tasks"
                  value={tasks.length.toString()}
                  icon={<ListTodo className="w-6 h-6 text-indigo-400" />}
                  variant="primary"
                />
              </StaggeredItem>
              <StaggeredItem className="h-full">
                <StatsCard
                  title="Completed"
                  value={completedCount.toString()}
                  icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
                  trend={tasks.length > 0 ? 'up' : undefined}
                  trendValue={tasks.length > 0 ? `${Math.round((completedCount / tasks.length) * 100)}%` : '0%'}
                  variant="secondary"
                />
              </StaggeredItem>
              <StaggeredItem className="h-full">
                <StatsCard
                  title="Pending"
                  value={pendingCount.toString()}
                  icon={<AlertCircle className="w-6 h-6 text-cyan-400" />}
                  variant="accent"
                />
              </StaggeredItem>
            </StaggeredList>

            {/* List Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <SlideIn>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    {filter === 'all' ? 'All Tasks' : filter === 'completed' ? 'Completed Tasks' : 'Pending Tasks'}
                  </h3>
                </SlideIn>
                <div className="flex gap-2 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-white hover:bg-white/5'}`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-all ${filter === 'pending' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-white hover:bg-white/5'}`}
                  >
                    PENDING
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 rounded-lg transition-all ${filter === 'completed' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-white hover:bg-white/5'}`}
                  >
                    COMPLETED
                  </button>
                </div>
              </div>

              <div className="max-w-4xl">
                <TaskList
                  tasks={filteredTasks}
                  loading={loading}
                  error={error}
                  onRetry={fetchTasks}
                  onToggleCompletion={handleToggleCompletion}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onAddNewTask={handleAddNewTask}
                />
              </div>
            </div>
          </div>
        </BounceIn>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-0 glass border-white/10 overflow-hidden rounded-[32px] shadow-2xl shadow-indigo-500/10">
            <div className="bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 p-10 border-b border-white/5 text-center">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-4xl font-black text-white tracking-tight block">
                    {editingTask ? 'Refine Task' : 'New Task'}
                  </span>
                </DialogTitle>
                <p className="text-slate-400 font-medium mt-3">
                  {editingTask ? 'Make the necessary adjustments' : 'Capture your next achievement'}
                </p>
              </DialogHeader>
            </div>
            <div className="p-10">
              <TaskForm
                task={editingTask || undefined}
                onSave={handleSaveTask}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default TasksPage;