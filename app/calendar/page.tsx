"use client";

import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import ProtectedPage from "@/components/ProtectedPage";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { tasksApi } from "@/features/tasks/api";
import { toGregorianISO, toPersianDisplay } from "@/lib/dateUtils";
import type { Task, NewTaskInput } from "@/features/tasks/types";

function CalendarContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const isoDate = toGregorianISO(selectedDate);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({ date: isoDate });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoDate]);

  async function handleAdd({ title, priority }: NewTaskInput) {
    const data = await tasksApi.createTask({ title, priority, type: "daily", date: isoDate });
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
    <div className="grid gap-8 md:grid-cols-[auto,1fr]">
      <div className="rounded-2xl border border-line bg-white/60 p-4 shadow-sm">
        <DatePicker
          value={selectedDate}
          onChange={(dateObject: DateObject | null) =>
            dateObject && setSelectedDate(dateObject.toDate())
          }
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-center"
        />
      </div>

      <div className="rounded-2xl border border-line bg-white/60 p-6 shadow-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-ink">برنامه روز</h2>
          <span className="font-mono text-xs text-ink-light">{toPersianDisplay(selectedDate)}</span>
        </div>

        {loading ? (
          <p className="text-sm text-ink-light">در حال بارگذاری...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-ink-light">هنوز آیتمی برای این روز ثبت نشده.</p>
        ) : (
          <div>
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-line pt-3">
          <AddTaskForm onAdd={handleAdd} placeholder="آیتم جدید برای این روز..." />
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <ProtectedPage>
      <CalendarContent />
    </ProtectedPage>
  );
}
