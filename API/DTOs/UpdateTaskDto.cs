using System;

namespace API.DTOs;

public class UpdateTaskDto : CreateTaskDto
{
    public int Id { get; set; }
}
