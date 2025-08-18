export type TaskEntity = {
  // Core details
  id: number
  title: string
  description: string

  // Status & progress
  status: string
  priority: string
  isCompleted: boolean
  isTrashed: boolean

  // Dates
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  dueDate: Date
  reminderAt: Date

  // Foreign key to Project
  projectId: number
  project: {
    id: number
    name: string
    // Add other fields as needed
  }
}