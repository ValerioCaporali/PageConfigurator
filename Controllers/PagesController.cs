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

        [HttpGet("HomePages")]
        public async Task<ActionResult<List<Page>>> GetHomePages()
        {
            var homePagesJson = await System.IO.File.ReadAllTextAsync("Pages/home.json");
            List<Page> homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            return homePages;
        }

        [HttpGet("Pages")]
        public async Task<ActionResult<List<Page>>> GetPages()
        {
            var pagesJson = await System.IO.File.ReadAllTextAsync("Pages/pages.json");
            List<Page> pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            return pages;
        }

        [HttpPost("SaveHomePages")]
        public ActionResult SaveHomePages() // To-Do
        {
            return Ok("Home pages salvate correttamente !");
        }

        [HttpPost("SavePages")]
        public ActionResult SavePages()
        {
            return Ok("Pagine salvate correttamente !");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
