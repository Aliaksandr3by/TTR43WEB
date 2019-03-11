using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Filters
{
    public class AllowAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            StringValues all = "*";
            var ctx = filterContext.HttpContext;
            var allow = ctx.Request.Headers["Allow"];
            ctx.Response.Headers.Add("Allow", "GET, POST, OPTIONS");
            base.OnActionExecuting(filterContext);
        }
    }
}
