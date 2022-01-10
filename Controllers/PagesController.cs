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

    [ApiController]
    [Route("api/[controller]")]
    public class PagesController : Controller
    {
        private readonly ILogger<PagesController> _logger;

        public PagesController(ILogger<PagesController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index(int pageIndex)
        {
            ViewBag.Index = pageIndex;
            return View();
        }

        public IActionResult Pages()
        {
            return View();
        }

        // use this to return to javascript the json with home pages
        [HttpGet("HomePages")]
        public async Task<ActionResult<List<Page>>> GetHomePages()
        {
            var homePagesJson = await System.IO.File.ReadAllTextAsync("Controllers/home.json");
            var homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            return homePages;
        }

        // use this to return to javascript the json with normal pages
        [HttpGet("Pages")]
        public async Task<ActionResult<List<Page>>> GetPages()
        {
            var pagesJson = await System.IO.File.ReadAllTextAsync("Controllers/pages.json");
            var pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            return pages;
        }

        // use this to save all home pages
        [HttpPost("SaveHomePages")]
        public string SaveHomePages()
        {
            return "Home pages saved !";
        }

        // use this to save all pages
        [HttpPost("SavePages")]
        public string SavePages()
        {
            return "Pages Saved !";
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
