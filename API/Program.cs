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

// 📘 Add Swagger/OpenAPI
builder.Services.AddSwaggerGen();

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

app.Run();
