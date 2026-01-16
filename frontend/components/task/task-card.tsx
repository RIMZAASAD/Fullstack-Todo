import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleCompletion, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-3 border border-gray-200">
      <div className="flex items-start">
        <div className="flex items-center h-5 mt-1">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mr-3"
          />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <label
            htmlFor={`task-${task.id}`}
            className={`text-base font-medium ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;