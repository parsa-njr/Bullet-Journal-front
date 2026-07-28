"use client";

import { useState, FormEvent } from "react";
import type { NewTaskInput, TaskPriority } from "@/features/tasks/types";

interface AddTaskFormProps {
  onAdd: (input: NewTaskInput) => void;
  placeholder?: string;
}

export default function AddTaskForm({ onAdd, placeholder = "یه آیتم جدید بنویس..." }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority });
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="text-ink-light">•</span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent py-2 text-sm text-ink placeholder:text-ink-light/50 focus:outline-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-light focus:outline-none"
      >
        <option value="low">کم</option>
        <option value="medium">متوسط</option>
        <option value="high">زیاد</option>
      </select>
      <button
        type="submit"
        className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-paper transition hover:bg-ink-light"
      >
        افزودن
      </button>
    </form>
  );
}
