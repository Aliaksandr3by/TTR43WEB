using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Filters
{
    public class ContentTypeJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Headers.Add("Content-Type", "application/json;charset=UTF-8");
            filterContext.HttpContext.Response.Headers.Add("Accept", "Application/json");
            base.OnActionExecuting(filterContext);
        }
    }
    public class ContentTypeHTMLAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Headers.Add("Content-Type", "text/html;charset=utf-8");
            base.OnActionExecuting(filterContext);
        }
    }
    public class ContentTypeXMLAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Headers.Add("Content-Type", "application/xml;charset=UTF-8");
            base.OnActionExecuting(filterContext);
        }
    }
}
