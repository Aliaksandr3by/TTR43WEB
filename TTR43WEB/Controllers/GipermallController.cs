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

    class PageSize
    {
        public int pageSize { get; set; }
    }
    public class GipermallController : Controller
    {
        private readonly IGipermollTableData gipermollTableData;
        private readonly Product _product;
        public GipermallController(IGipermollTableData gipermollTable, Product product)
        {
            gipermollTableData = gipermollTable;
            _product = product;
        }

        [HttpGet]
        public IActionResult Index(int productPage = 1, int pageSize = 5)
        {
            var data = gipermollTableData.Products;
            int fn(Product e) => e.Id;
            int countProducts = data.Count<Product>();
            int totalPages = countProducts / pageSize;
            IQueryable<Product> result = data
                .OrderBy(fn)
                .Skip((pageSize - 1) * productPage)
                .Take((new int[] { pageSize, countProducts }).Min())
                .AsQueryable<Product>();
            return View("Index", result);
        }

        [HttpPost]
        public IActionResult Pagination([FromBody]JObject pageSize)
        {
            try
            {
                var _pageSize = pageSize.ToObject<PageSize>().pageSize;
                var data = gipermollTableData.Products;
                int countProducts = data.Count<Product>();
                int totalPages = countProducts / _pageSize;

                var result = Json(new
                {
                    countProducts,
                    totalPages,
                    pageSize = _pageSize,
                    valueDefault = new int[] { 3, 5, 7, 10, 15, 20, 25, 30, 50, 100, 150 }
                });

                return result;
            }
            catch (Exception)
            {
                throw;
            }
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
