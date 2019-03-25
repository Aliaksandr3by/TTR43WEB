using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using DatumServer.Datum.User;
using TTR43WEB.Models.User;
using TTR43WEB.Universal;

namespace TTR43WEB.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UsersContextQueryable db;

        public AccountController(UsersContextQueryable context)
        {
            db = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult RequestVerificationToken()
        {
            return PartialView("__RequestVerificationToken");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            try
            {
                var userAgent = Request.Headers["User-Agent"].FirstOrDefault();
                var host = Request.Headers["Host"].FirstOrDefault();

                var __RequestVerificationToken = Base64.Base64Encode(userAgent.ToString());

                return this.Json(new
                {
                    __RequestVerificationToken,
                    login = HttpContext.User.Identity.Name,
                    isAuthenticated = HttpContext.User.Identity.IsAuthenticated,
                }
                );
            }
            catch (Exception ex)
            {
                return this.Json(new
                {
                    __RequestVerificationToken = "",
                    error = ex.Message,
                    authorize = HttpContext.User.Identity.IsAuthenticated,
                });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromForm]LoginModel _model)
        {
            LoginModel model = _model;
            //LoginModel model = JsonConvert.DeserializeObject<LoginModel>(_model); //[FromForm]string _model
            //var model = _model.ToObject<LoginModel>(); //[FromForm]JObject _model
            var a = db.GetUserContext();

            if (ModelState.IsValid)
            {
                Users user = await db.Users.FirstOrDefaultAsync(u => u.Login == model.Login && u.Password == model.Password);

                if (user != null)
                {
                    var id = await Authenticate(model.Login); // аутентификация

                    return Json(new
                    {
                        Login = id.Name,
                    });
                }

                ModelState.AddModelError("", "Некорректные логин и(или) пароль");
            }

            var error = new List<string>();

            foreach (var modelStateVal in this.ViewData.ModelState.Values)
            {
                error.AddRange(modelStateVal.Errors.Select(err => err.ErrorMessage));
            }

            return this.Json(new
            {
                error
            }); ;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }



        public IActionResult BannerImage()
        {
            var file = Path.Combine(Directory.GetCurrentDirectory(), "public", "image", "Untitled.jpg");

            return PhysicalFile(file, "image/svg+xml");
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                Users user = await db.Users.FirstOrDefaultAsync(u => u.Login == model.Email);
                if (user == null)
                {
                    // добавляем пользователя в бд
                    db.Add(new Users { Login = model.Email, Password = model.Password });
                    db.SaveChangesAsync();

                    var id = await Authenticate(model.Email); // аутентификация

                    return Json(new
                    {
                        authorize = id.IsAuthenticated,
                        Login = id.Name,
                    });
                }
                else
                {
                    ModelState.AddModelError("", "Некорректные логин и(или) пароль");
                }
            }
            return View(model);
        }


        [AllowAnonymous]
        public async Task<IActionResult> AccessDenied()
        {
            return Json(new
            {
                authorize = "",
            });
        }

        private async Task<ClaimsIdentity> Authenticate(string userName)
        {
            // создаем один claim
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName),
                //new Claim(ClaimTypes.Role, "Administrator"),
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(id),
                new AuthenticationProperties
                    {
                        //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10)
                    }
                );
            return id;
        }
        [AllowAnonymous]
        public async Task Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
