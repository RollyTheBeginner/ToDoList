using API.DTOs;
using API.Entities;
using API.Enums;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController(ITaskRepository taskRepo, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<TaskEntity>>> GetTasks()
        {
            return await taskRepo.GetTasksAsync();
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<TaskEntity>>> GetTasksByProject(int projectId)
        {
            return await taskRepo.GetTasksByProjectAsync(projectId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskEntity>> GetTask(int id)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpGet("today")]
        public async Task<ActionResult<List<TaskEntity>>> GetTodayTasks()
        {
            return await taskRepo.GetTodayTasksAsync();
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<List<TaskEntity>>> GetUpcomingTasks([FromQuery] int? month, [FromQuery] int? year)
        {
            return await taskRepo.GetUpcomingTasksAsync(month, year);
        }

        [HttpGet("completed")]
        public async Task<ActionResult<List<TaskEntity>>> GetCompletedTasks()
        {
            return await taskRepo.GetCompletedTasksAsync();
        }

        [HttpGet("overdue")]
        public async Task<ActionResult<List<TaskEntity>>> GetOverdueTasks()
        {
            return await taskRepo.GetOverdueTasksAsync();
        }

        [HttpGet("trashed")]
        public async Task<ActionResult<List<TaskEntity>>> GetTrashedTasks()
        {
            return await taskRepo.GetTrashedTasksAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TaskEntity>> CreateTask(CreateTaskDto createTaskDto)
        {
            var task = mapper.Map<TaskEntity>(createTaskDto);
            await taskRepo.AddTaskAsync(task);

            if (await taskRepo.SaveAllAsync())
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);

            return BadRequest("Problem creating new task");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            mapper.Map(updateTaskDto, task);

            if (await taskRepo.SaveAllAsync()) return NoContent();

            return BadRequest("Problem updating task");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            taskRepo.RemoveTask(task);

            if (await taskRepo.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting task");
        }

        [HttpPut("trash/{id}")]
        public async Task<ActionResult> TrashTask(int id)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.IsTrashed = true;

            if (await taskRepo.SaveAllAsync()) return Ok();

            return BadRequest("Problem trashing task");
        }

        [HttpPut("restore/{id}")]
        public async Task<ActionResult> RestoreTask(int id)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.IsTrashed = false;

            if (await taskRepo.SaveAllAsync()) return Ok();

            return BadRequest("Problem restoring task");
        }

        [HttpPatch("{id}/complete")]
        public async Task<ActionResult> CompleteTask(int id)
        {
            var task = await taskRepo.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.Status = TasksStatus.Completed;
            task.IsCompleted = true;

            if (await taskRepo.SaveAllAsync()) return Ok();

            return BadRequest("Problem marking task as completed");
        }
    }
}
