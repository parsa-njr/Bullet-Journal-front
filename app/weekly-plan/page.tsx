"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { tasksApi } from "@/features/tasks/api";
import {
  buildJalaliWeekKey,
  getCurrentJalaliYearMonth,
  getWeeksInMonth,
  jalaliWeekKeyToLabel,
  JALALI_MONTH_NAMES,
  toPersianDigits,
} from "@/lib/dateUtils";
import type { Task, NewTaskInput } from "@/features/tasks/types";

function WeeklyPlanContent() {
  const { year: defaultYear, month: defaultMonth } = getCurrentJalaliYearMonth();
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [week, setWeek] = useState(1);
  const weeksInMonth = getWeeksInMonth(month);
  const currentWeekKey = buildJalaliWeekKey(year, month, week);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({ week: currentWeekKey });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, week]);

  useEffect(() => {
    if (week > weeksInMonth) setWeek(1);
  }, [weeksInMonth, week]);


  async function handleAdd({ title, priority }: NewTaskInput) {
    const data = await tasksApi.createTask({
      title,
      priority,
      type: "weekly",
      weekKey: currentWeekKey,
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
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">برنامه هفته</h2>
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

      <div className="mb-4 flex items-center gap-2">
        {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            className={`rounded-full px-3 py-1 text-xs transition ${w === week ? "bg-ink text-paper" : "border border-line text-ink-light hover:bg-ink/5"
              }`}
          >
            هفته {toPersianDigits(w)}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs text-ink-light">{jalaliWeekKeyToLabel(currentWeekKey)}</p>
      <p className="mb-4 text-xs text-ink-light">
        اهداف و کارهای کلی‌تر این هفته را اینجا یادداشت کن؛ جزئیات روزانه در تقویم ثبت می‌شود.
      </p>

      {loading ? (
        <p className="text-sm text-ink-light">در حال بارگذاری...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-ink-light">هنوز آیتمی برای این هفته ثبت نشده.</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <AddTaskForm onAdd={handleAdd} placeholder="هدف این هفته..." />
      </div>
    </div>
  );
}

export default function WeeklyPlanPage() {
  return (
    <ProtectedPage>
      <WeeklyPlanContent />
    </ProtectedPage>
  );
}
