using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using DatumServer.Datum.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using TTR43WEB.Models.Gipermall;
using TTR43WEB.Models.User;

namespace TTR43WEB {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.Configure<CookiePolicyOptions> (options => {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddDataProtection ().SetDefaultKeyLifetime (TimeSpan.FromDays (14));;

            services.AddDbContext<ProductContext> (options => options.UseSqlServer (Configuration["ConnectionStrings:ConnectionProduct"]));
            services.AddScoped<IProductsContextQueryable, ProductsContextQueryable> ();

            services.AddDbContext<UserContext> (options => options.UseSqlServer (Configuration["ConnectionStrings:ConnectionUser"]));
            services.AddScoped<IUsersContextQueryable, UsersContextQueryable> ();

            // Inside your ConfigureServices method
            services.AddAuthentication (options => {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie (options => {
                    options.LoginPath = new Microsoft.AspNetCore.Http.PathString ("/Account/Login");
                    options.Cookie.HttpOnly = false;
                });

            services.AddMvc ().SetCompatibilityVersion (CompatibilityVersion.Version_2_2);

            services.AddDirectoryBrowser ();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IHostingEnvironment env) {
            //env.EnvironmentName = "Production";
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else {
                app.UseExceptionHandler ("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts ();
            }

            var cachePeriod = env.IsDevelopment () ? "600" : "604800";

            //DefaultFilesOptions options = new DefaultFilesOptions();
            //options.DefaultFileNames.Clear();
            //options.DefaultFileNames.Add("index.html");
            //app.UseDefaultFiles(options);

            app.UseStaticFiles (new StaticFileOptions {
                OnPrepareResponse = ctx => {
                    ctx.Context.Response.Headers.Append ("Cache-Control", $"public, max-age={cachePeriod}");
                }
            });

            if (env.IsDevelopment ()) {
                try {
                    app.UseFileServer (new FileServerOptions {
                        FileProvider = new PhysicalFileProvider (Path.Combine (Directory.GetCurrentDirectory (), "wwwroot/public/html")),
                            RequestPath = "/Statics",
                            EnableDirectoryBrowsing = true
                    });

                    app.UseDirectoryBrowser (new DirectoryBrowserOptions () {
                        FileProvider = new PhysicalFileProvider (Path.Combine (Directory.GetCurrentDirectory (), @"wwwroot\StaticFilesHide")),

                            RequestPath = new PathString ("/StaticFile")
                    });
                } catch (System.Exception ex) {
                    Console.WriteLine (ex.Message);
                }
            } else {

            }

            app.UseAuthentication ();
            app.UseHttpsRedirection ();
            app.UseCookiePolicy ();
            app.UseStatusCodePages ();
            //app.UseBrowserLink();

            app.UseMvc (routes => {
                routes.MapRoute (name: "index", template: "{controller=Gipermall}/{action=Index}");
                routes.MapRoute (name: "ItemsProduct", template: "{controller=Gipermall}/{action=ItemsProduct}/Page{productPage:int}/Size{pageSize:int}");
                routes.MapRoute (name: "ItemsProductAdd", template: "{controller=Gipermall}/{action=ItemsProduct}");
                routes.MapRoute (name: null, template: "{controller=Gipermall}/{action=OptionsURIinBase}");
                routes.MapRoute (name: "tableUrl", template: "{controller=Gipermall}/{action=AllItemsUrls}/{id?}");
                routes.MapRoute (name: "getCoastAsync", template: "{controller=Gipermall}/{action=GetCoastAsync}/{id?}");

                routes.MapRoute (name: "Login", template: "{controller=Account}/{action=Login}");
                routes.MapRoute (name: "Register", template: "{controller=Account}/{action=Register}");
                routes.MapRoute (name: "AccessDenied", template: "{controller=Account}/{action=AccessDenied}");
                routes.MapRoute (name: "__RequestVerificationToken", template: "{controller=Account}/{action=RequestVerificationToken}");

            });
        }
    }
}