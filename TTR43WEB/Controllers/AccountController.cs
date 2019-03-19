﻿using System;
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
using TTR43WEB.Models.User;
using TTR43WEB.Universal;

namespace TTR43WEB.Controllers
{
    public class AccountController : Controller
    {
        private readonly UsersContextQueryable db;

        public AccountController(UsersContextQueryable context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            try
            {
                var userAgent = Request.Headers["User-Agent"].FirstOrDefault();
                var host = Request.Headers["Host"].FirstOrDefault(); 

                var __RequestVerificationToken = Base64.Base64Encode(userAgent.ToString());

                return this.Json(new { __RequestVerificationToken });
            }
            catch (Exception ex)
            {
                return this.Json(new { __RequestVerificationToken = "", error = ex.Message });
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
                User user = await db.Users.FirstOrDefaultAsync(u => u.Login == model.Login && u.Password == model.Password);

                if (user != null)
                {
                    await Authenticate(model.Login); // аутентификация

                    return Json(new
                    {
                        user
                    });
                }

                ModelState.AddModelError("", "Некорректные логин и(или) пароль");
            }
            
            var errors = new List<string>();

            foreach (var modelStateVal in this.ViewData.ModelState.Values)
            {
                errors.AddRange(modelStateVal.Errors.Select(error => error.ErrorMessage));
            }

            var result = this.Json(new { model, status = "validation-error", errors });

            return result;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }


        [Authorize]
        public IActionResult BannerImage()
        {
            var file = Path.Combine(Directory.GetCurrentDirectory(), "public", "image", "Untitled.jpg");

            return PhysicalFile(file, "image/svg+xml");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                User user = await db.Users.FirstOrDefaultAsync(u => u.Login == model.Email);
                if (user == null)
                {
                    // добавляем пользователя в бд
                    db.Add(new User { Login = model.Email, Password = model.Password });
                    db.SaveChangesAsync();

                    await Authenticate(model.Email); // аутентификация

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "Некорректные логин и(или) пароль");
                }
            }
            return View(model);
        }

        private async Task Authenticate(string userName)
        {
            // создаем один claim
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName)
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }
    }
}
