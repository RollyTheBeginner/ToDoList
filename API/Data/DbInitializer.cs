using System;
using API.Entities;
using API.Enums;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<TaskContext>()
            ?? throw new InvalidOperationException("Failed to retrieve TaskContext from service provider.");

        SeedData(context);

    }



    private static void SeedData(TaskContext context)
    {
        context.Database.Migrate();

        if (context.TaskEntities.Any())
        {
            return; // Database has already been seeded
        }

        var projects = new List<ProjectEntity>

        {
            new()
            {
                Name = "API Development",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                Tasks = new List<TaskEntity>() // empty for now; will be linked later
            },
            new()
            {
                Name = "Infrastructure Setup",
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                Tasks = new List<TaskEntity>()
            },
            new()
            {
                Name = "Frontend Redesign",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                Tasks = new List<TaskEntity>()
            }
        };

        context.ProjectEntities.AddRange(projects);
        context.SaveChanges();


        var tasks = new List<TaskEntity>
        {
            // TODAY
            new()
            {
                Id = 1,
                Title = "Fix login bug",
                Description = "Resolve the issue causing login failures.",
                Status = TasksStatus.InProgress,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date,
                ReminderAt = DateTime.UtcNow.Date.AddHours(9),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 2,
                Title = "Write API documentation",
                Description = "Complete API docs for version 2 endpoints.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date,
                ReminderAt = DateTime.UtcNow.Date.AddHours(14),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 3,
                Title = "Review pull requests",
                Description = "Check pending PRs for feature branch.",
                Status = TasksStatus.InProgress,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date,
                ReminderAt = DateTime.UtcNow.Date.AddHours(11),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 4,
                Title = "Team standup meeting",
                Description = "Daily sync with the development team.",
                Status = TasksStatus.InProgress,
                Priority = TaskPriority.Low,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date,
                ReminderAt = DateTime.UtcNow.Date.AddHours(10),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 5,
                Title = "Update project roadmap",
                Description = "Revise milestones and deliverables for Q3.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date,
                ReminderAt = DateTime.UtcNow.Date.AddHours(16),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },

            // UPCOMING
            new()
            {
                Id = 6,
                Title = "Design new landing page",
                Description = "Create wireframes and mockups.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(3),
                ReminderAt = DateTime.UtcNow.Date.AddDays(3).AddHours(9),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 7,
                Title = "Database optimization",
                Description = "Improve query performance for reports.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(6),
                ReminderAt = DateTime.UtcNow.Date.AddDays(6).AddHours(10),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 8,
                Title = "Client presentation prep",
                Description = "Prepare slides for next week's demo.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(8),
                ReminderAt = DateTime.UtcNow.Date.AddDays(8).AddHours(13),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 9,
                Title = "Code refactor sprint",
                Description = "Clean up legacy code before release.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(10),
                ReminderAt = DateTime.UtcNow.Date.AddDays(10).AddHours(14),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },
            new()
            {
                Id = 10,
                Title = "Security audit",
                Description = "Conduct penetration testing on app.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-6),
                UpdatedAt = DateTime.UtcNow,
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(13),
                ReminderAt = DateTime.UtcNow.Date.AddDays(13).AddHours(11),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },

            // COMPLETED
            new()
            {
                Id = 11,
                Title = "Deploy v2.1 release",
                Description = "Deployed stable release to production.",
                Status = TasksStatus.Completed,
                Priority = TaskPriority.High,
                IsCompleted = true,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                CompletedAt = DateTime.UtcNow.AddDays(-10),
                DueDate = DateTime.UtcNow.Date.AddDays(-10),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-10).AddHours(9),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 12,
                Title = "Fix critical payment bug",
                Description = "Resolved transaction error in checkout.",
                Status = TasksStatus.Completed,
                Priority = TaskPriority.High,
                IsCompleted = true,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                CompletedAt = DateTime.UtcNow.AddDays(-8),
                DueDate = DateTime.UtcNow.Date.AddDays(-8),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-8).AddHours(10),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 13,
                Title = "Write unit tests",
                Description = "Coverage increased to 85%.",
                Status = TasksStatus.Completed,
                Priority = TaskPriority.Medium,
                IsCompleted = true,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-6),
                CompletedAt = DateTime.UtcNow.AddDays(-6),
                DueDate = DateTime.UtcNow.Date.AddDays(-6),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-6).AddHours(15),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 14,
                Title = "Team retrospective meeting",
                Description = "Discussed last sprint outcomes.",
                Status = TasksStatus.Completed,
                Priority = TaskPriority.Low,
                IsCompleted = true,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-9),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                CompletedAt = DateTime.UtcNow.AddDays(-5),
                DueDate = DateTime.UtcNow.Date.AddDays(-5),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-5).AddHours(11),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },
            new()
            {
                Id = 15,
                Title = "Update user guides",
                Description = "User manuals refreshed for new features.",
                Status = TasksStatus.Completed,
                Priority = TaskPriority.Medium,
                IsCompleted = true,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-4),
                CompletedAt = DateTime.UtcNow.AddDays(-4),
                DueDate = DateTime.UtcNow.Date.AddDays(-4),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-4).AddHours(14),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },

            // TRASHED (IsTrashed = true)
            new()
            {
                Id = 16,
                Title = "Old marketing campaign",
                Description = "Discarded outdated campaign assets.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Low,
                IsCompleted = false,
                IsTrashed = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-25),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-25),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-26).AddHours(9),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 17,
                Title = "Deprecated feature cleanup",
                Description = "Removed legacy features from repo.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = true,
                CreatedAt = DateTime.UtcNow.AddDays(-28),
                UpdatedAt = DateTime.UtcNow.AddDays(-23),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-23),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-24).AddHours(10),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 18,
                Title = "Unused CSS cleanup",
                Description = "Eliminated unused style rules.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Low,
                IsCompleted = false,
                IsTrashed = true,
                CreatedAt = DateTime.UtcNow.AddDays(-27),
                UpdatedAt = DateTime.UtcNow.AddDays(-22),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-22),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-22).AddHours(11),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 19,
                Title = "Archive old project docs",
                Description = "Moved docs to archive storage.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Low,
                IsCompleted = false,
                IsTrashed = true,
                CreatedAt = DateTime.UtcNow.AddDays(-29),
                UpdatedAt = DateTime.UtcNow.AddDays(-24),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-24),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-23).AddHours(9),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 20,
                Title = "Canceled client meeting",
                Description = "Meeting canceled by client.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Low,
                IsCompleted = false,
                IsTrashed = true,
                CreatedAt = DateTime.UtcNow.AddDays(-31),
                UpdatedAt = DateTime.UtcNow.AddDays(-26),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-26),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-25).AddHours(8),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },

            // OVERDUE (DueDate < today, IsCompleted = false, IsTrashed = false)
            new()
            {
                Id = 21,
                Title = "Submit quarterly report",
                Description = "Financial report submission delayed.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-7),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-7).AddHours(9),
                ProjectId = 1,
                Project = projects.First(p => p.Id == 1)
            },
            new()
            {
                Id = 22,
                Title = "Fix critical security flaw",
                Description = "Patch overdue for security vulnerability.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-18),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-6),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-6).AddHours(10),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            },
            new()
            {
                Id = 23,
                Title = "Complete user feedback analysis",
                Description = "Overdue review of customer feedback.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-16),
                UpdatedAt = DateTime.UtcNow.AddDays(-7),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-5),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-5).AddHours(13),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },
            new()
            {
                Id = 24,
                Title = "Update CI/CD pipeline",
                Description = "Pipeline update overdue for new features.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.Medium,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-4),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-4).AddHours(15),
                ProjectId = 3,
                Project = projects.First(p => p.Id == 3)
            },
            new()
            {
                Id = 25,
                Title = "Refactor legacy codebase",
                Description = "Refactoring overdue before next release.",
                Status = TasksStatus.Pending,
                Priority = TaskPriority.High,
                IsCompleted = false,
                IsTrashed = false,
                CreatedAt = DateTime.UtcNow.AddDays(-13),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                CompletedAt = null,
                DueDate = DateTime.UtcNow.Date.AddDays(-2),
                ReminderAt = DateTime.UtcNow.Date.AddDays(-2).AddHours(11),
                ProjectId = 2,
                Project = projects.First(p => p.Id == 2)
            }
        };

        context.TaskEntities.AddRange(tasks);
        context.SaveChanges();
    }
}
