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
                    drafts = dbPage.drafts != null ? JsonConvert.DeserializeObject<List<TableContent>>(dbPage.drafts) : null,
                    contents = JsonConvert.DeserializeObject<List<TableContent>>(dbPage.contents)
                };
                pages.Add(page);
            }
            return pages;
        }

        
        [HttpPost("publish")]
        public IActionResult SavePage([FromBody] Guid Id)
        {

            DbPage page = _context.Pages.Find(Id);
            if (page != null)
            {
                page.contents = page.drafts;
                page.drafts = null;
                _context.SaveChanges();
                return Ok("Page correctly published");
            }
            return BadRequest("Page not found");

        }

        [HttpPost("save-draft")]
        public IActionResult SaveInDraft([FromBody] SaveDto saveDto)
        {
            if (saveDto.Page == null || saveDto.InitialPage == null)
            {
                return BadRequest("Invalid sent data");
            }
            DbPage page = _context.Pages.Find(saveDto.Page.id);
            DbPage updatedPage = new DbPage();
            List<TableContent> drafts = new List<TableContent>();
            List<TableContent> contents = JsonConvert.DeserializeObject<List<TableContent>>(page.contents);
            if (page.drafts != null)
            {
                drafts = JsonConvert.DeserializeObject<List<TableContent>>(page.drafts);
                
                int oldDraftIndex = drafts.FindIndex(draft => draft.Language == saveDto.InitialPage.contents.First().Language);
                if (oldDraftIndex == -1)
                {
                    drafts.Add(saveDto.Page.contents.First());
                }
                else
                {
                    drafts[oldDraftIndex] = saveDto.Page.contents.First();
                }
            }
            else
            {
                drafts.Add(saveDto.Page.contents.First());
                foreach (TableContent content in contents)
                {
                    if (content.Language != saveDto.InitialPage.contents.First().Language)
                    {
                        drafts.Add(content);
                    }
                }
            }

            updatedPage = page;
            updatedPage.drafts = JsonConvert.SerializeObject(drafts);
            _context.Entry(page).CurrentValues.SetValues(updatedPage);
            _context.SaveChanges();
            return Ok("Page correctly saved");
        }

        [HttpPost("delete-draft")]
        public IActionResult DeleteFraft(Guid pageId)
        {
            return Ok();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
