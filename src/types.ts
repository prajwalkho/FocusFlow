export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string | null;
  status: 'Pending' | 'Completed';
  category: string;
  createdAt: string;
}

export interface ProductivityLog {
  date: string;
  tasksCompleted: number;
  focusTime: number;
}
