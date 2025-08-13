using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class TaskContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<TaskEntity> TaskEntities { get; set; } = null!;
    public DbSet<ProjectEntity> ProjectEntities { get; set; } = null!;
}