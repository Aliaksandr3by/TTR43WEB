using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Filters
{
    public class AccessControlAllowAllAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            StringValues all = "*";
            var ctx = filterContext.HttpContext;
            var referer = filterContext.HttpContext.Request.Headers["referer"];
            var origin = ctx.Request.Headers["Origin"];
            var allowOrigin = origin.Count > 0 ? origin : all; //err StringValues.IsNullOrEmpty(ctx3)
            ctx.Response.Headers.Add("Access-Control-Allow-Origin", allowOrigin);
            ctx.Response.Headers.Add("Access-Control-Allow-Headers", "*");
            ctx.Response.Headers.Add("Access-Control-Allow-Methods", "*");
            ctx.Response.Headers.Add("Access-Control-Allow-Credentials", "false");
            base.OnActionExecuting(filterContext);
        }
    }
}
