export type TaskType = "daily" | "weekly" | "monthly";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  type: TaskType;
  date: string | null; // فرمت میلادی YYYY-MM-DD (برای ذخیره‌سازی و مرتب‌سازی سمت بک‌اند)
  weekKey: string | null; // فرمت شمسی: jYYYY-Www
  monthKey: string | null; // فرمت شمسی: jYYYY-jMM
  priority: TaskPriority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewTaskInput {
  title: string;
  priority: TaskPriority;
}

export interface TaskQuery {
  date?: string;
  week?: string;
  month?: string;
}

export interface CreateTaskPayload {
  title: string;
  priority: TaskPriority;
  type: TaskType;
  date?: string;
  weekKey?: string;
  monthKey?: string;
}
