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


        List<string> ErrorMaker(ValueEnumerable modelStateEntries)
        {
            var error = new List<string>();

            foreach (var modelStateVal in modelStateEntries)
            {
                error.AddRange(modelStateVal.Errors.Select(err => err.ErrorMessage));
            }

            return error;
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromForm]LoginModel _model)
        {
            LoginModel model = _model;

            if (ModelState.IsValid)
            {

                bool flagTelephoneNumber = long.TryParse(model.Login, out long TelephoneNumber); //Convert.ToInt64(model.Login);
                var user1 = await db.Users.FirstOrDefaultAsync((u) => u.TelephoneNumber == TelephoneNumber);
                Users user = await db.Users.FirstOrDefaultAsync(
                    (u) => (u.Login == model.Login || u.Email == model.Login || u.TelephoneNumber == TelephoneNumber) && u.Password == model.Password);

                if (user != null)
                {
                    var id = await Authenticate(user); // аутентификация

                    return Json(new
                    {
                        user,
                    });
                }

                ModelState.AddModelError("", "Не найден логин и(или) пароль");
            }

            return this.Json(new
            {
                errorUserLogin = ErrorMaker(this.ViewData.ModelState.Values),
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
                if (user == null && model.TelephoneNumber != null)
                {
                    //model.DateTimeRegistration = DateTime.Now;

                    var tmpUser = new Users
                    {
                        Login = model.Login,
                        Email = model.Email,
                        TelephoneNumber = model.TelephoneNumber ?? default,
                        Password = model.Password,
                        PasswordConfirm = model.PasswordConfirm,
                        DateTimeRegistration = DateTime.Now,
                        Role = model.Role,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                    };

                    var tmp = db.Add(tmpUser);

                    int count = db.SaveChanges();

                    var id = await Authenticate(tmpUser); // аутентификация

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
                    if (user.Login != null)
                    {
                        ModelState.AddModelError("", "Некорректные логин и(или) пароль");
                    }
                    else if (user.TelephoneNumber >= 0)
                    {
                        ModelState.AddModelError("", "Телефонный номер уже использован");
                    }
                }
            }
            return this.Json(new
            {
                errorUserRegister = ErrorMaker(this.ViewData.ModelState.Values),
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

        private async Task<ClaimsIdentity> Authenticate(Users user)
        {
            var userAgent = new UserAgent
            {
                UserAgentData = Request.Headers["User-Agent"].FirstOrDefault(),
                GuidUser = user.Guid,
            };
            db.GetUserContext().Add(userAgent);
            await db.GetUserContext().SaveChangesAsync();
            // создаем один claim
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
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
