using API.Data;
using API.Interfaces;
using API.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<TaskContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddScoped<ITaskRepository, TaskRepository>();

var app = builder.Build();


app.UseRouting();

app.UseCors(opt =>
{
    opt.AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("https://localhost:3001");
});

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
