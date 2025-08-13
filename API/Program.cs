using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// 📦 Add Controllers
builder.Services.AddControllers();
<<<<<<< HEAD
builder.Services.AddDbContext<TaskContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
=======

// 📘 Add Swagger/OpenAPI
builder.Services.AddSwaggerGen();
>>>>>>> 96fc6c0201d26fda215028e63a4e618dc8df05a7

var app = builder.Build();

// 🛠️ Configure Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication(); // 🔐 Must come before Authorization
app.UseAuthorization();

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
