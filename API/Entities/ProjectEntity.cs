using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class ProjectEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public List<TaskEntity> Tasks { get; set; } = new();
}
