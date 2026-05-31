using System.Net;
using System.Text.Json;
using FluentValidation;
using Logistik.Domain.Exceptions;

namespace Logistik.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message, errors) = exception switch
        {
            NotFoundException nfe => (HttpStatusCode.NotFound, nfe.Message, (string[])[]),
            DomainException de => (HttpStatusCode.BadRequest, de.Message, (string[])[]),
            ValidationException ve => (HttpStatusCode.UnprocessableEntity, "Validation failed.",
                ve.Errors.Select(e => e.ErrorMessage).ToArray()),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized.", (string[])[]),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.", (string[])[])
        };

        if (exception is not NotFoundException && exception is not DomainException && exception is not ValidationException)
            _logger.LogError(exception, "Unhandled exception");

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = new { message, errors };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
