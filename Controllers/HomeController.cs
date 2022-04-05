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
using Model.PageModel;
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
            string homePagesJson = await System.IO.File.ReadAllTextAsync("Pages/home.json"),
                pagesJson = await System.IO.File.ReadAllTextAsync("Pages/pages.json");
            List<Page> homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson),
                       pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            int homePagesNumber = homePages.Count(), 
                pagesNumber = pages.Count();
            ViewBag.HomePagesNumber = homePagesNumber;
            ViewBag.PagesNumber = pagesNumber;

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
