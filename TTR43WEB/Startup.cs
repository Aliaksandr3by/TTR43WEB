using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TTR43WEB.Models.Gipermall;

namespace TTR43WEB
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddDbContext<ContextGipermall>(options => options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnectionProduct"]));

            services.AddTransient<Product, Product>();
            services.AddScoped<IGipermollTableData, GipermollTable>();
            //services.AddSingleton<ITable, EFTable>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //env.EnvironmentName = "Production";
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseStatusCodePages();
            //app.UseBrowserLink();

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "index",template: "{controller=Gipermall}/{action=Index}");

                routes.MapRoute(name: "table",template: "{controller=Gipermall}/{action=Table}/{id?}");
                routes.MapRoute(name: "tableUrl",template: "{controller=Gipermall}/{action=AllItemsUrls}/{id?}");

                routes.MapRoute(name: "getCoastAsync", template: "{controller=Gipermall}/{action=GetCoastAsync}/{id?}");

            });
        }
    }
}
