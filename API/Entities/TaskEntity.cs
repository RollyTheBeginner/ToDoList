using System;
using API.Enums;

namespace API.Entities;

public class TaskEntity
{
    // Core details
    public int Id { get; set; }
    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;

    // Status & progress
    public TasksStatus Status { get; set; } = TasksStatus.Pending;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public bool IsCompleted { get; set; }
    public bool IsTrashed { get; set; } = false;

    // Dates
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime ReminderAt { get; set; } = new();

    // Foreign key to Project
    public int ProjectId { get; set; }
    public ProjectEntity Project { get; set; } = null!;
}
