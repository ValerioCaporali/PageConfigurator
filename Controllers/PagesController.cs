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
using API.DTOs;
using API.Interfaces;

namespace Pages_configurator.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class PagesController : Controller
    {
        private int count = 0;
        private List<Page> pages;
        private List<Page> homePages;
        private readonly ILogger<PagesController> _logger;
        private IBindingService _bindingService;

        public PagesController(ILogger<PagesController> logger, IBindingService bindingService)
        {
            _logger = logger;
            _bindingService = bindingService;
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

        [HttpGet("home-pages")]
        public async Task<ActionResult<List<Page>>> GetHomePages()
        {
            var homePagesJson = await System.IO.File.ReadAllTextAsync("Pages/home.json");
            List<Page> homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            this.homePages = homePages;
            return homePages;
        }


        [HttpGet("pages")]
        public async Task<ActionResult<List<Page>>> GetPages()
        {
            var pagesJson = await System.IO.File.ReadAllTextAsync("Pages/pages.json");
            List<Page> pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            this.pages = pages;
            return pages;
        }
        [HttpGet("get-all")]
        public async Task GetAll()
        {
            var pagesJson = await System.IO.File.ReadAllTextAsync("Pages/pages.json");
            List<Page> pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);
            var homePagesJson = await System.IO.File.ReadAllTextAsync("Pages/home.json");
            List<Page> homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            
            _bindingService.BindPagesFromJson(homePages, pages);
        }

        
        [HttpPost("save-page")]
        public IActionResult SavePage([FromBody] SaveDto saveDto)
        {

            if (this.homePages.Where(page => page.Id == saveDto.Page.Id && page.Language == saveDto.Page.Language).Count() > 1)
                return BadRequest("I valori identificativi per la pagina non sono univoci");

            if (this.pages.Where(page => page.Id == saveDto.Page.Id && page.Language == saveDto.Page.Language).Count() > 1)
                return BadRequest("I valori identificativi per la pagina non sono univoci");

            var home_correspondence = this.homePages.Where(page => page.Id == saveDto.InitialPage.Id && page.Language == saveDto.InitialPage.Language);
            var page_correspondence = this.homePages.Where(page => page.Id == saveDto.InitialPage.Id && page.Language == saveDto.InitialPage.Language);
            if (!home_correspondence.Any() && !page_correspondence.Any())
            {
                return BadRequest("La pagina che si sta modificando non esiste");
            }

            if (home_correspondence.Any())
            {
                // fare qui tutti i controlli                
                this.homePages.RemoveAll(page => page.Id == saveDto.InitialPage.Id && page.Language == saveDto.InitialPage.Id);
                this.homePages.Add(saveDto.Page);
                return Ok("Home salvata correttamente");
            }

            if (page_correspondence.Any())
            {
                // fare qui tutti i controlli
                this.pages.RemoveAll(page => page.Id == saveDto.InitialPage.Id && page.Language == saveDto.InitialPage.Id);
                this.pages.Add(saveDto.Page);
                return Ok("Pagina salvata correttamente");
            }

            return BadRequest("Errore durante il salvataggio");

        }

        // convert json to table
        public void Convert() 
        {

        }

        public Boolean isPageValid(Page page)
        {
            return false;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
