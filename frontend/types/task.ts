export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description: string;
  completed?: boolean;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
}