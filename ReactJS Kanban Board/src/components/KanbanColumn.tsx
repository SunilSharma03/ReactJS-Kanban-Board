import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import { Column } from '../types';
import SortableTask from './SortableTask';

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
}

export default function KanbanColumn({ column, onAddTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">{column.title}</h2>
          <span className="text-sm font-medium text-gray-500">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="p-4 space-y-3 min-h-[200px]"
      >
        <SortableContext
          items={column.tasks}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>

        <button
          onClick={onAddTask}
          className="w-full py-2 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
}