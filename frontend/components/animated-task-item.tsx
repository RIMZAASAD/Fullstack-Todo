'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AnimatedTaskItem({
  id,
  title,
  description,
  completed,
  priority = 'medium',
  dueDate,
  onToggle,
  onDelete
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className={`transition-all duration-300 ${
        completed
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="mt-1"
            >
              <Checkbox
                id={id}
                checked={completed}
                onCheckedChange={() => onToggle(id)}
                className={`border-2 ${
                  completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-500'
                }`}
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <motion.h3
                  className={`font-medium truncate ${
                    completed
                      ? 'text-slate-500 line-through'
                      : 'text-slate-100'
                  }`}
                  animate={{
                    color: completed ? '#64748b' : '#f1f5f9'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {title}
                </motion.h3>

                <div className="flex items-center gap-2 ml-2">
                  {priority && (
                    <Badge
                      variant="secondary"
                      className={`${priorityColors[priority]} text-xs px-2 py-1 text-white`}
                    >
                      {priority}
                    </Badge>
                  )}

                  {dueDate && (
                    <span className="text-xs text-slate-400">
                      {new Date(dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {description && (
                <motion.p
                  className={`text-sm mt-1 truncate ${
                    completed ? 'text-slate-600' : 'text-slate-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {description}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 5
              }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(id)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}