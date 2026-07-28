"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { tasksApi } from "@/features/tasks/api";
import {
  buildJalaliMonthKey,
  getCurrentJalaliYearMonth,
  jalaliMonthKeyToLabel,
  JALALI_MONTH_NAMES,
  toPersianDigits,
} from "@/lib/dateUtils";
import type { Task, NewTaskInput } from "@/features/tasks/types";

function MonthlyPlanContent() {
  const { year: defaultYear, month: defaultMonth } = getCurrentJalaliYearMonth();
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const currentMonthKey = buildJalaliMonthKey(year, month);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({ month: currentMonthKey });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  async function handleAdd({ title, priority }: NewTaskInput) {
    const data = await tasksApi.createTask({
      title,
      priority,
      type: "monthly",
      monthKey: currentMonthKey,
    });
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

  return (
    <div className="rounded-2xl border border-line bg-white/60 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">برنامه ماه</h2>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-light focus:outline-none"
          >
            {JALALI_MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-light focus:outline-none"
          >
            {[defaultYear - 1, defaultYear, defaultYear + 1].map((y) => (
              <option key={y} value={y}>
                {toPersianDigits(y)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mb-2 text-xs text-ink-light">{jalaliMonthKeyToLabel(currentMonthKey)}</p>
      <p className="mb-4 text-xs text-ink-light">
        اهداف کلی و رویدادهای مهم این ماه را اینجا یادداشت کن.
      </p>

      {loading ? (
        <p className="text-sm text-ink-light">در حال بارگذاری...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-ink-light">هنوز آیتمی برای این ماه ثبت نشده.</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <AddTaskForm onAdd={handleAdd} placeholder="هدف این ماه..." />
      </div>
    </div>
  );
}

export default function MonthlyPlanPage() {
  return (
    <ProtectedPage>
      <MonthlyPlanContent />
    </ProtectedPage>
  );
}
