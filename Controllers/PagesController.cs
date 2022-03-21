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
using API.Data;
using API.Entities;
using API.Model;
using Model.Page.Contents;

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
        private DataContext _context;

        public PagesController(ILogger<PagesController> logger, IBindingService bindingService, DataContext context)
        {
            _logger = logger;
            _bindingService = bindingService;
            _context = context;
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

        [HttpGet("get-all")]
        public async Task<ActionResult<List<TablePage>>> GetAll()
        {
            await _bindingService.BindPagesFromJsonAsync();

            List<TablePage> pages = new List<TablePage>();
            List<DbPage> dbPages = _context.Pages.ToList();
            foreach (DbPage dbPage in dbPages)
            {

                TablePage page = new TablePage
                {
                    id = dbPage.id,
                    type = dbPage.type,
                    visibility = dbPage.visibility,
                    slug = dbPage.slug,
                    description = dbPage.description,
                    contents = JsonConvert.DeserializeObject<List<TableContent>>(dbPage.contents)
                };

                pages.Add(page);

            }
            
            return pages;
        }

        
        [HttpPost("save-page")]
        public IActionResult SavePage([FromBody] SaveDto saveDto)
        {

            DbPage page = _context.Pages.Find(saveDto.Page.id);
            List<TableContent> contents = JsonConvert.DeserializeObject<List<TableContent>>(page.contents);
            int oldContentIndex = contents.FindIndex(content => content.Language == saveDto.InitialPage.contents.First().Language);
            if (oldContentIndex == -1)
                return BadRequest("Il contenuto della pagina non esiste");
            
            TableContent updatedContent = saveDto.Page.contents.First();

            contents[oldContentIndex] = updatedContent;
            DbPage updatedPage = new DbPage();
            updatedPage = page;
            updatedPage.contents = JsonConvert.SerializeObject(contents);

            _context.Entry(page).CurrentValues.SetValues(updatedPage);

            _context.SaveChanges();


            return Ok("Pagina salvata correttamente");

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
