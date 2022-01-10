using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Pages_configurator.Models;
// using Model.Root;
using Model.PageModel;
// using Model.PageModel.PageWidget.WidgetCont;
using Model.PageModel.PageWidget.WidgetContent;

namespace Pages_configurator.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            /* using (var client = new HttpClient())
            {
                var uri = new Uri("https://api.publicapis.org/entries");

                var response = await client.GetAsync(uri);

                var stringData = await response.Content.ReadAsStringAsync(); // serialize http content into string
                
                var data = JsonConvert.DeserializeObject<Test>(stringData); // that's the way to take data from http response using models

                ViewBag.Data = data.entries;

                return View();

            } */

            ViewBag.prova = "boh";
            var homePagesJson = await System.IO.File.ReadAllTextAsync("Controllers/home.json");
            var homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            var homePagesNumber = homePages.Count();
            var test = JsonConvert.SerializeObject(homePages);
            ViewBag.HomePagesNumber = homePagesNumber;
            ViewBag.AllHomePages = homePages;
            ViewBag.PagesJson = test;
            var specificPage = homePages[0];
            Console.WriteLine(homePages);

            var pagesJson = await System.IO.File.ReadAllTextAsync("Controllers/pages.json");
            var pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            var pagesNumber = pages.Count();
            ViewBag.PagesNumber = pagesNumber;
            ViewBag.AllPages = pages;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
