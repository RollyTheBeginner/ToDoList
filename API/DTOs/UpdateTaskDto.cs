using System;
using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.DTOs;

public class UpdateTaskDto : CreateTaskDto
{
    [Required]
    public int Id { get; set; }

    public new CreateProjectDto? NewProject { get; } = null;
}
