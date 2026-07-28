import { apiClient } from "@/lib/apiClient";
import type { Task, TaskQuery, CreateTaskPayload } from "./types";

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

export const tasksApi = {
  getTasks: (query: TaskQuery) =>
    apiClient.get<TasksResponse>("/tasks", { params: query }).then((res) => res.data),

  createTask: (payload: CreateTaskPayload) =>
    apiClient.post<TaskResponse>("/tasks", payload).then((res) => res.data),

  updateTask: (id: string, payload: Partial<Task>) =>
    apiClient.patch<TaskResponse>(`/tasks/${id}`, payload).then((res) => res.data),

  deleteTask: (id: string) =>
    apiClient.delete<{ message: string }>(`/tasks/${id}`).then((res) => res.data),
};
