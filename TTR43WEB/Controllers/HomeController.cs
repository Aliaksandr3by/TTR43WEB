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
using TTR43WEB.Models;
using Newtonsoft;

namespace TTR43WEB.Controllers
{

    public class HomeController : Controller
    {
        private readonly ITable itableRepository;

        public HomeController(ITable tabl)
        {
            itableRepository = tabl;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Gipermall()
        {
            return View();
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject dataSend)
        {
            DataSend dataSendObj = dataSend.ToObject<DataSend>();
            var description = await GetDataFromGipermall.GetDescriptionResult(dataSendObj.value);
            var result = Json(new
            {
                description
            });
            return result;
        }

        [HttpGet]
        [ContentTypeHTML]
        [AccessControlAllow]
        public IActionResult GetTabl(string id, string Henry, string Ford)
        {
            switch (id)
            {
                case "Table_4_1":
                    return PartialView("_GetTable", itableRepository.Table41);
                default:
                    return PartialView("_GetTable", itableRepository.Table41);
            }
        }

        [HttpPost]
        [AccessControlAllow]
        [ContentTypeJson]
        public IActionResult GetTable([FromBody]JObject dataSend)
        {
            var AttachmentA = itableRepository.AttachmentA;
            foreach (var item in AttachmentA)
            {
                var a = Json(item);
            }
            var result = Json(new
            {
                AttachmentA
            });
            return result;
        }

        [HttpPost]
        [AccessControlAllow]
        [ContentTypeJson]
        public IActionResult GetAllTable([FromBody]JObject dataSend)
        {
            var Table41 = itableRepository.Table41;
            var Table43 = itableRepository.Table43;
            var Table44 = itableRepository.Table44;
            var Table51 = from entry3 in itableRepository.Table51
                            join entry2 in itableRepository.Table512 on entry3.KindOfActivity equals entry2.Id
                            join entry1 in itableRepository.Table511 on entry3.TypeBuild equals entry1.Id
                            select new
                            {
                                entry3.Id,
                                entry2.KindOfActivity,
                                entry1.TypeBuild,
                                entry3.Enclosure,
                                entry3.StandardResistanceHeatTransfer,
                                entry3.CalculationType
                            };
            var Table53 = itableRepository.Table53;
            var Table54 = itableRepository.Table54;
            var Table55 = itableRepository.Table55;
            var Table551 = itableRepository.Table551;
            var Table57 = itableRepository.Table57;
            var AttachmentA = itableRepository.AttachmentA;
            var AttachmentB = itableRepository.AttachmentB;
            var AttachmentG = itableRepository.AttachmentG;
            var AttachmentJ = itableRepository.AttachmentJ;

            var result = Json(new
            {
                Table41,
                Table43,
                Table44,
                Table51,
                Table53,
                Table54,
                Table55,
                Table551,
                Table57,
                AttachmentA,
                AttachmentB,
                AttachmentG,
                AttachmentJ
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
