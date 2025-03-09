import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  low: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  high: {
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
  },
};

export default function TaskCard({ task }: TaskCardProps) {
  const { color, icon: Icon } = priorityConfig[task.priority];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            color
          )}
        >
          <Icon className="w-3 h-3 mr-1" />
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-2 text-sm text-gray-500">{task.description}</p>
      )}
    </div>
  );
}