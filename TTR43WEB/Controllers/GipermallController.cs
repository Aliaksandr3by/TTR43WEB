using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using TTR43WEB.Data;
using TTR43WEB.Filters;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Newtonsoft.Json.Linq;
using AngleSharp;
using Newtonsoft;
using TTR43WEB.Models.Gipermall;
using TTR43WEB.Models.Attachment;

namespace TTR43WEB.Controllers
{

    public class GipermallController : Controller
    {
        private readonly Product _product;
        public GipermallController(Product product)
        {
            _product = product;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject idGoods)
        {
            DataSend dataSendObj = idGoods.ToObject<DataSend>();

            GetDataFromGipermall getDataFromGipermall = new GetDataFromGipermall(_product);

            var description = await getDataFromGipermall.GetFullDescriptionResult(dataSendObj.IdGoods);

            var result = Json(new
            {
                description
            });

            return result;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new Models.ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
