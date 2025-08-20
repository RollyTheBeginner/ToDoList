using API.Entities;

namespace API.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskEntity>> GetTasksAsync();
    Task<List<TaskEntity>> GetTasksByProjectAsync(int projectId);
    Task<TaskEntity?> GetTaskByIdAsync(int id);
    Task<List<TaskEntity>> GetTodayTasksAsync();
    Task<List<TaskEntity>> GetUpcomingTasksAsync(int? month, int? year);
    Task<List<TaskEntity>> GetCompletedTasksAsync();
    Task<List<TaskEntity>> GetOverdueTasksAsync();
    Task<List<TaskEntity>> GetTrashedTasksAsync();

    Task AddTaskAsync(TaskEntity task);
    void RemoveTask(TaskEntity task);
    Task<bool> SaveAllAsync();
}