using System;
using API.Data;
using API.Entities;
using API.Enums;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class TaskRepository(TaskContext context) : ITaskRepository
{
    public async Task<List<TaskEntity>> GetTasksAsync()
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => !t.IsTrashed)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<TaskEntity>> GetTasksByProjectAsync(int projectId)
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.ProjectId == projectId && !t.IsTrashed)
            .OrderBy(t => t.DueDate)
            .ToListAsync();
    }

    public async Task<TaskEntity?> GetTaskByIdAsync(int id)
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<TaskEntity>> GetTodayTasksAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.DueDate == today && !t.IsCompleted && !t.IsTrashed)
            .ToListAsync();
    }

    public async Task<List<TaskEntity>> GetUpcomingTasksAsync(int? month, int? year)
    {
        var today = DateTime.UtcNow.Date;
        var query = context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.DueDate >= today && !t.IsCompleted && !t.IsTrashed);

        if (month.HasValue && year.HasValue)
        {
            query = query.Where(t => t.DueDate.Month == month && t.DueDate.Year == year);
        }

        return await query.OrderBy(t => t.DueDate).ToListAsync();
    }

    public async Task<List<TaskEntity>> GetCompletedTasksAsync()
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.Status == TasksStatus.Completed && !t.IsTrashed)
            .OrderBy(t => t.DueDate)
            .ToListAsync();
    }

    public async Task<List<TaskEntity>> GetOverdueTasksAsync()
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.DueDate < DateTime.UtcNow.Date && !t.IsCompleted && !t.IsTrashed)
            .ToListAsync();
    }

    public async Task<List<TaskEntity>> GetTrashedTasksAsync()
    {
        return await context.TaskEntities
            .Include(t => t.Project)
            .Where(t => t.IsTrashed)
            .ToListAsync();
    }

    public async Task AddTaskAsync(TaskEntity task)
    {
        await context.TaskEntities.AddAsync(task);
    }

    public void RemoveTask(TaskEntity task)
    {
        context.TaskEntities.Remove(task);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}