"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { tasksApi } from "@/features/tasks/api";
import { toGregorianISO, toPersianDisplay } from "@/lib/dateUtils";
import type { Task, NewTaskInput } from "@/features/tasks/types";

function DashboardContent() {
  const today = toGregorianISO(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({ date: today });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd({ title, priority }: NewTaskInput) {
    const data = await tasksApi.createTask({ title, priority, type: "daily", date: today });
    setTasks((prev) => [...prev, data.task]);
  }

  async function handleToggle(task: Task) {
    const data = await tasksApi.updateTask(task._id, { isCompleted: !task.isCompleted });
    setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
  }

  async function handleDelete(task: Task) {
    await tasksApi.deleteTask(task._id);
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
  }

  const doneCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="rounded-2xl border border-line bg-white/60 p-6 shadow-sm">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold text-ink">برنامه امروز</h2>
        <span className="font-mono text-xs text-ink-light">{toPersianDisplay(new Date())}</span>
      </div>
      <p className="mb-4 text-xs text-ink-light">
        {tasks.length > 0 ? `${doneCount} از ${tasks.length} انجام شد` : "شروع کن به نوشتن!"}
      </p>

      {loading ? (
        <p className="text-sm text-ink-light">در حال بارگذاری...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-ink-light">هنوز آیتمی برای امروز ثبت نشده.</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <AddTaskForm onAdd={handleAdd} placeholder="کاری که امروز باید انجام بشه..." />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardContent />
    </ProtectedPage>
  );
}
