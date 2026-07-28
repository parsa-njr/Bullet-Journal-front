"use client";

import type { Task, TaskPriority } from "@/features/tasks/types";

const priorityColor: Record<TaskPriority, string> = {
  low: "bg-sage",
  medium: "bg-amber",
  high: "bg-rose",
};

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="group flex items-start gap-3 border-b border-line py-3 last:border-none">
      {/* بولت به سبک بولت‌ژورنال: دایره توپر که با تیک به علامت درست تبدیل می‌شود */}
      <button
        onClick={() => onToggle(task)}
        aria-label={task.isCompleted ? "علامت زدن به عنوان انجام‌نشده" : "علامت زدن به عنوان انجام‌شده"}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          task.isCompleted
            ? "border-sage bg-sage text-paper"
            : "border-ink-light text-transparent hover:border-sage"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
          <path
            d="M4 10l4 4 8-8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityColor[task.priority]}`}
            title={`اولویت: ${task.priority}`}
          />
          <p
            className={`font-body text-sm transition-colors ${
              task.isCompleted ? "text-ink-light/50 line-through" : "text-ink"
            }`}
          >
            {task.title}
          </p>
        </div>
        {task.description && (
          <p className="mt-0.5 text-xs text-ink-light">{task.description}</p>
        )}
      </div>

      <button
        onClick={() => onDelete(task)}
        className="opacity-0 transition-opacity group-hover:opacity-100 text-ink-light hover:text-rose"
        aria-label="حذف تسک"
      >
        ✕
      </button>
    </div>
  );
}
