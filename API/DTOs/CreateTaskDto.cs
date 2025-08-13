using System;
using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.DTOs;

public class CreateTaskDto
{
    // Core details
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    // Status & progress
    public TasksStatus Status { get; set; } = TasksStatus.Pending;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public bool IsCompleted { get; set; } = false;

    // Dates
    [Required]
    public DateTime DueDate { get; set; }

    public DateTime? ReminderAt { get; set; }

    public int? ProjectId { get; set; }
    public CreateProjectDto? NewProject { get; set; }
}
