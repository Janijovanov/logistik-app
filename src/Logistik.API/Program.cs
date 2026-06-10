using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Hangfire;
using Logistik.API.Middleware;
using Logistik.Application;
using Logistik.Infrastructure;
using Logistik.Infrastructure.BackgroundJobs;
using Logistik.Infrastructure.Persistence.Seeders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/logistik-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

// Prevent ASP.NET Core from remapping JWT claim names (e.g. "sub" → NameIdentifier)
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Application + Infrastructure layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

// JWT Authentication
var jwtKey = builder.Configuration["JwtSettings:SecretKey"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS — allow any origin so Railway env-var overrides can't block the frontend.
// JWT bearer tokens don't require AllowCredentials(); dropping it lets us use SetIsOriginAllowed.
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// Hangfire
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddHangfire(config =>
    config.UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseStorage(new Hangfire.MySql.MySqlStorage(connectionString,
              new Hangfire.MySql.MySqlStorageOptions { TablesPrefix = "Hangfire_" })));
builder.Services.AddHangfireServer();

// OpenAPI (built-in .NET 10)
builder.Services.AddOpenApi();

// Health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

// Pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Logistik API")
               .WithTheme(ScalarTheme.Purple)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

if (app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Hangfire dashboard
app.UseHangfireDashboard("/hangfire");

// Register recurring jobs
RecurringJob.AddOrUpdate<OrderStatusUpdateJob>(
    "order-status-update",
    job => job.ExecuteAsync(),
    "5 0 * * *");

RecurringJob.AddOrUpdate<EmploymentEndCheckJob>(
    "employment-end-check",
    job => job.ExecuteAsync(),
    "0 6 * * *");

RecurringJob.AddOrUpdate<EmailRetryJob>(
    "email-retry",
    job => job.ExecuteAsync(),
    "*/15 * * * *");

app.Run();
