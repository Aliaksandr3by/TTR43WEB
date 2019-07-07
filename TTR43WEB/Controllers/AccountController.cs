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
using DatumServer.Datum.userttr43;
using TTR43WEB.Models.User;
using TTR43WEB.Universal;
using static Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary;
using TTR43WEB.Models.Gipermall;

namespace TTR43WEB.Controllers
{
    //TODO: подписать методы
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
                var result = new
                {
                    isAuthenticated = HttpContext.User.Identity.IsAuthenticated,
                    Login = HttpContext.User.Identity.Name,
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
                Users user = await db.Users.FirstOrDefaultAsync(
                    (u) => (u.Login == model.Login || u.Email == model.Login || u.TelephoneNumber == _model.Login) && u.Password == model.Password);

                if (user != null)
                {
                    var id = await Authenticate(user); // аутентификация

                    UserLite userLite = new UserLite
                    {
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Login = user.Login,
                        Guid = user.Guid,
                        TelephoneNumber = user.TelephoneNumber,
                    };

                    return Json(new
                    {
                        user = userLite,
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

                if (user == null)
                {
                    Users tmpUser = new Users
                    {
                        Login = model.Login,
                        Email = model.Email,
                        TelephoneNumber = model.TelephoneNumber,
                        Password = model.Password,
                        PasswordConfirm = model.PasswordConfirm,
                        DateTimeRegistration = DateTime.Now,
                        Role = model.Role,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                    };

                    var tmp = db.AddUser(tmpUser);

                    int count = db.SaveChanges();

                    var id = await Authenticate(tmpUser);

                    return Json(new
                    {
                        User = new UserLite().ToUserLite(tmp.Entity),
                        count,
                    });
                }
                else
                {
                    if (user.Login == model.Login)
                    {
                        ModelState.AddModelError("", "Логин уже использован логин");
                    }
                    if (user.TelephoneNumber == model.TelephoneNumber)
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
                DateAutorizate = DateTime.Now,
            };

            db.GetUserContext().Add(userAgent);

            await db.GetUserContext().SaveChangesAsync();


            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
            };

            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

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
