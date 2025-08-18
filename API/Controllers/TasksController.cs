using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController(TaskContext context, IMapper mapper) : ControllerBase
    {
        [HttpGet] // https://localhost:5001/api/tasks
        public ActionResult<List<TaskEntity>> GetTasks()
        {
            return context.TaskEntities
            .Include(t => t.Project)
            .Where(t => !t.IsTrashed)
            .OrderByDescending(t => t.CreatedAt)
            .ToList();
        }

        [HttpGet("project/{projectId}")] //https://localhost:5021/api/tasks/project/{projectId}
        public ActionResult<List<TaskEntity>> GetTasksByProject(int projectId)
        {
            var tasks = context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.ProjectId == projectId && !t.IsTrashed)
                .OrderBy(t => t.DueDate)
                .ToList();

            return Ok(tasks);
        }


        [HttpGet("{id}")] // https://localhost:5001/api/tasks/1
        public ActionResult<TaskEntity> GetTask(int id)
        {
            var task = context.TaskEntities
            .Include(t => t.Project)
            .FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            return task;
        }

        [HttpGet("today")] // https://localhost:5001/api/tasks/today
        public ActionResult<List<TaskEntity>> GetTodayTasks()
        {
            var today = DateTime.UtcNow.Date;

            var todayTasks = context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.DueDate == today && !t.IsCompleted && !t.IsTrashed)
                .ToList();

            return todayTasks;
        }

        [HttpGet("upcoming")] // https://localhost:5001/api/tasks/upcoming
        public ActionResult<List<TaskEntity>> GetUpcomingTasks([FromQuery] int? month, [FromQuery] int? year)
        {
            var today = DateTime.UtcNow.Date;

            var tasksQuery = context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.DueDate >= today && !t.IsCompleted && !t.IsTrashed);

            if (month.HasValue && year.HasValue)
            {
                tasksQuery = tasksQuery.Where(t => t.DueDate.Month == month.Value && t.DueDate.Year == year.Value);
            }

            return tasksQuery.OrderBy(t => t.DueDate).ToList();
        }

        [HttpGet("completed")] // https://localhost:5001/api/tasks/completed
        public async Task<ActionResult<List<TaskEntity>>> GetCompletedTasks()
        {
            var completedTasks = await context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.Status == TasksStatus.Completed && !t.IsTrashed)
                .OrderBy(t => t.DueDate)
                .ToListAsync();

            return completedTasks;
        }

        [HttpGet("overdue")] // https://localhost:5001/api/tasks/overdue
        public ActionResult<List<TaskEntity>> GetOverdueTasks()
        {
            var overdueTasks = context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.DueDate < DateTime.UtcNow.Date && !t.IsCompleted && !t.IsTrashed)
                .ToList();

            return overdueTasks;
        }

        [HttpGet("trashed")] // https://localhost:5001/api/tasks/trashed
        public ActionResult<List<TaskEntity>> GetTrashedTasks()
        {
            var trashedTasks = context.TaskEntities
                .Include(t => t.Project)
                .Where(t => t.IsTrashed)
                .ToList();

            return trashedTasks;
        }

        [HttpPost]
        public async Task<ActionResult<TaskEntity>> CreateTask(CreateTaskDto createTaskDto)
        {
            // Rule enforcement
            bool hasProjectId = createTaskDto.ProjectId.HasValue;
            bool hasNewProject = createTaskDto.NewProject != null;

            if (!hasProjectId && !hasNewProject)
            {
                return BadRequest("You must provide either an existing ProjectId or a new project.");
            }

            if (hasProjectId && hasNewProject)
            {
                return BadRequest("You cannot provide both ProjectId and a new project.");
            }

            // Create new project if needed
            if (hasNewProject)
            {
                var project = new ProjectEntity
                {
                    Name = createTaskDto.NewProject!.Name,
                    CreatedAt = DateTime.UtcNow
                };

                context.ProjectEntities.Add(project);
                await context.SaveChangesAsync();

                createTaskDto.ProjectId = project.Id;
            }

            var task = mapper.Map<TaskEntity>(createTaskDto);
            context.TaskEntities.Add(task);

            var result = await context.SaveChangesAsync() > 0;

            if (result)
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);

            return BadRequest("Problem creating new task");
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await context.TaskEntities.FindAsync(id);
            if (task == null) return NotFound();

            mapper.Map(updateTaskDto, task);

            var result = await context.SaveChangesAsync() > 0;
            if (result) return NoContent();

            return BadRequest("Problem updating task");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var task = await context.TaskEntities.FindAsync(id);

            if (task == null) return NotFound();

            context.TaskEntities.Remove(task);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem deleting task");
        }

        [HttpPut("trash/{id}")]
        public async Task<ActionResult> TrashTask(int id)
        {
            var task = await context.TaskEntities.FindAsync(id);

            if (task == null) return NotFound();

            task.IsTrashed = true;

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem trashing task");
        }

        [HttpPut("restore/{id}")]
        public async Task<ActionResult> RestoreTask(int id)
        {
            var task = await context.TaskEntities.FindAsync(id);

            if (task == null) return NotFound();

            task.IsTrashed = false;

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem restoring task");
        }

        [HttpPatch("{id}/complete")] // PATCH api/tasks/{id}/complete
        public async Task<ActionResult> CompleteTask(int id)
        {
            var task = await context.TaskEntities.FindAsync(id);
            if (task == null) return NotFound();

            task.Status = TasksStatus.Completed; // update enum status
            task.IsCompleted = true; // optional: keep this for easier querying

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem marking task as completed");
        }

    }
}
