import { apiClient } from '@/lib/api/api-client';
import { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';

class TaskService {
  // Get all tasks for the authenticated user
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>('/tasks');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }

  // Get a specific task by ID
  async getTaskById(id: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch task with ID ${id}`);
    }
  }

  // Create a new task
  async createTask(taskData: TaskCreateInput): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  // Update a task
  async updateTask(id: string, taskData: TaskUpdateInput): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update task with ID ${id}`);
    }
  }

  // Toggle task completion status
  async toggleTaskCompletion(id: string): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to toggle completion for task with ID ${id}`);
    }
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete task with ID ${id}`);
    }
  }
}

export const taskService = new TaskService();
export default TaskService;