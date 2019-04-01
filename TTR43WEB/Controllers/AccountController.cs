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
using static Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary;

namespace TTR43WEB.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly IUsersContextQueryable db;

        public AccountController(IUsersContextQueryable context)
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

                var result = new
                {
                    isAuthenticated = HttpContext.User.Identity.IsAuthenticated,
                };

                return this.Json(result);
            }
            catch (Exception ex)
            {
                return this.Json(new
                {
                    error = ex.Message,
                });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromForm]LoginModel _model)
        {
            LoginModel model = _model;

            if (ModelState.IsValid)
            {
                Users user = await db.Users.FirstOrDefaultAsync(u => u.Login == model.Login && u.Password == model.Password);

                if (user != null)
                {
                    var id = await Authenticate(model.Login); // аутентификация

                    return Json(new
                    {
                        user,
                    });
                }

                ModelState.AddModelError("", "Некорректные логин и(или) пароль");
            }

            List<string> ErrorMaker(ValueEnumerable modelStateEntries)
            {
                var error = new List<string>();

                foreach (var modelStateVal in modelStateEntries)
                {
                    error.AddRange(modelStateVal.Errors.Select(err => err.ErrorMessage));
                }

                return error;
            }

            return this.Json(new
            {
                errorUser = ErrorMaker(this.ViewData.ModelState.Values),
            });
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register([FromForm]RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                Users user = await db.Users.FirstOrDefaultAsync( u => u.Login == model.Login || u.TelephoneNumber == model.TelephoneNumber);
                if (user == null)
                {
                    //model.DateTimeRegistration = DateTime.Now;

                    db.Add(new Users {
                        Login = model.Login,
                        Email = model.Email,
                        TelephoneNumber = model.TelephoneNumber,
                        Password = model.Password,
                        PasswordConfirm = model.PasswordConfirm,
                        DateTimeRegistration = model.DateTimeRegistration,
                        Role = model.Role,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                    });

                    int count = db.SaveChanges();

                    var id = await Authenticate(model.Login); // аутентификация

                    user = await db.Users.FirstOrDefaultAsync(u => u.Login == id.Name);

                    return Json(new
                    {
                        user,
                        userName = id.Name,
                        count,
                    });
                }
                else
                {
                    ModelState.AddModelError("", "Некорректные логин и(или) пароль, телефонный номер");
                }
            }

            var error = new List<string>();

            foreach (var modelStateVal in this.ViewData.ModelState.Values)
            {
                error.AddRange(modelStateVal.Errors.Select(err => err.ErrorMessage));
            }

            return this.Json(new
            {
                errorUser = error
            });
        }


        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return Json(new
            {
                authorize = "",
            });
        }

        public IActionResult BannerImage()
        {
            var file = Path.Combine(Directory.GetCurrentDirectory(), "public", "image", "Untitled.jpg");

            return PhysicalFile(file, "image/svg+xml");
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
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Json(new
            {
                authorize = HttpContext.User.Identity.IsAuthenticated
            });
        }
    }
}
