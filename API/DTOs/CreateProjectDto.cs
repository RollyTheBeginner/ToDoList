using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProjectDto
{
    [Required, StringLength(200)]
    public string Name { get; set; } = string.Empty;
    public List<CreateTaskDto>? Tasks { get; set; }
}
