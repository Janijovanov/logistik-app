using Logistik.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Logistik.API.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequiresCompanyAccessAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var currentUser = context.HttpContext.RequestServices.GetRequiredService<ICurrentUserService>();

        if (!context.ActionArguments.TryGetValue("companyId", out var companyIdObj) || companyIdObj is not int companyId)
        {
            await next();
            return;
        }

        if (!currentUser.HasCompanyAccess(companyId))
        {
            context.Result = new ForbidResult();
            return;
        }

        await next();
    }
}
