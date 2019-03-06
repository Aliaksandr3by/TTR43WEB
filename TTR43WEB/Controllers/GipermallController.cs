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

    public class PageSize
    {
        public int pageSize { get; set; }
    }
    public class GetDataTable
    {
        public int pageSize { get; set; }
        public int productPage { get; set; }
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

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public IActionResult Table([FromBody]GetDataTable getDataTable)
        {
            GetDataTable _getDataTable = getDataTable;
            var data = gipermollTableData.Products;
            DateTime fn(Product e) => e.Date;
            Func<Product, int> fn2 = e => (e.Id);
            int countProducts = data.Count<Product>();
            var result = data
                .OrderBy(fn2)
                .Skip((_getDataTable.productPage - 1) * _getDataTable.pageSize)
                .Take((new int[] { _getDataTable.pageSize, countProducts }).Min())
                .AsQueryable<Product>();

            var ProductInfo = Json(new
            {
                items = result,
                isLoaded = true,
            });

            return ProductInfo;
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public IActionResult Pagination([FromBody]JObject pageSize)
        {
            try
            {
                var _pageSize = pageSize.ToObject<PageSize>().pageSize;
                var data = gipermollTableData.Products;
                int totalItems = data.Count<Product>();
                int totalPages = (int)Math.Ceiling((decimal)totalItems / _pageSize);

                var result = Json(new
                {
                    totalItems,
                    totalPages,
                    pageSize = _pageSize,
                    valueDefault = new int[] { 3, 5, 7, 10, 15, 20, 25, 30, 50, 100, 150, totalItems }
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

            var _description = await getDataFromGipermall.GetFullDescriptionResult(dataSendObj.IdGoods, gipermollTableData.Products);
            var description = new
            {
                _description.Id,
                _description.Name,
                _description.Price,
                _description.PriceWithoutDiscount,
                _description.Date
            };
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
