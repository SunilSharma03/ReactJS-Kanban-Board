import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import { Column, Task } from '../types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: '1', title: 'Research competitors', description: 'Analyze main competitors and their features', priority: 'high' },
      { id: '2', title: 'Design system', description: 'Create a consistent design system', priority: 'medium' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: '3', title: 'User interviews', description: 'Conduct user interviews', priority: 'high' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: '4', title: 'Project setup', description: 'Initial project configuration', priority: 'low' },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === active.id);
    
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeColumnId = active.data.current?.sortable.containerId;
    const overColumnId = over.data.current?.sortable.containerId || over.id;

    if (activeColumnId !== overColumnId) {
      setColumns((columns) => {
        const activeColumn = columns.find((col) => col.id === activeColumnId);
        const overColumn = columns.find((col) => col.id === overColumnId);

        if (!activeColumn || !overColumn) return columns;

        const activeTask = activeColumn.tasks.find((task) => task.id === active.id);
        if (!activeTask) return columns;

        return columns.map((col) => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== active.id),
            };
          }
          if (col.id === overColumnId) {
            return {
              ...col,
              tasks: [...col.tasks, activeTask],
            };
          }
          return col;
        });
      });
    }

    setActiveTask(null);
  };

  const addNewTask = (columnId: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Task',
      description: 'Click to edit',
      priority: 'medium',
    };

    setColumns((columns) =>
      columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Kanban Board</h1>
        <p className="text-gray-600 mt-2">Drag and drop tasks between columns</p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={() => addNewTask(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}