using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController(TaskContext context, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<ProjectEntity>> GetProjects()
        {
            return context.ProjectEntities
                .Include(p => p.Tasks)
                .ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<ProjectEntity> GetProject(int id)
        {
            var project = context.ProjectEntities
                .Include(p => p.Tasks)
                .FirstOrDefault(p => p.Id == id);
            if (project == null)
            {
                return NotFound();
            }
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectEntity>> CreateProject(CreateProjectDto createProjectDto)
        {
            var project = new ProjectEntity
            {
                Name = createProjectDto.Name,
                CreatedAt = DateTime.UtcNow,
                Tasks = new List<TaskEntity>()
            };

            if (createProjectDto.Tasks != null && createProjectDto.Tasks.Any())
            {
                foreach (var taskDto in createProjectDto.Tasks)
                {
                    var task = mapper.Map<TaskEntity>(taskDto);
                    task.Project = project;
                    project.Tasks.Add(task);
                }
            }

            context.ProjectEntities.Add(project);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<List<ProjectEntity>>> DeleteProject(int id)
        {
            var project = await context.ProjectEntities
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                return NotFound();
            }

            context.ProjectEntities.Remove(project);
            await context.SaveChangesAsync();

            return await context.ProjectEntities
                .Include(p => p.Tasks)
                .ToListAsync();
        }
    }
}