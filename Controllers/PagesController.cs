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

        [HttpGet("get-all")]
        public async Task<ActionResult<List<CustomTablePage>>> GetAll()
        {
            await _bindingService.BindPagesFromJsonAsync();

            List<CustomTablePage> pages = new List<CustomTablePage>();
            List<DbPage> dbPages = _context.Pages.ToList();
            
            foreach (DbPage dbPage in dbPages)
            {
                CustomTablePage page = new CustomTablePage
                {
                    id = dbPage.id,
                    type = dbPage.type,
                    visibility = dbPage.visibility,
                    slug = dbPage.slug,
                    description = dbPage.description,
                    drafts = dbPage.drafts != null ? JsonConvert.DeserializeObject<List<CustomTableContent>>(dbPage.drafts) : null,
                    contents = JsonConvert.DeserializeObject<List<CustomTableContent>>(dbPage.contents)
                };
                pages.Add(page);
            }
            return pages;
        }
        
        [HttpPost("publish")]
        public IActionResult SavePage([FromBody] PublishDto publishDto)
        {

            DbPage page = _context.Pages.Find(publishDto.id);
            if (page != null)
            {
                List<TableContent> contents = new List<TableContent>();
                List<CustomTableContent> drafts = JsonConvert.DeserializeObject<List<CustomTableContent>>(page.drafts);
                page.visibility = drafts[0].Visibility;
                page.description = drafts[0].Description;
                page.slug = drafts[0].Slug;
                foreach (CustomTableContent draft in drafts)
                {
                    TableContent content = new TableContent {
                        Language = draft.Language,
                        Title = draft.Title,
                        Widgets = draft.Widgets
                    };
                    contents.Add(content);
                }
                page.contents = JsonConvert.SerializeObject(contents);
                page.drafts = null;
                _context.SaveChanges();
                return Ok("Page correctly published");
            }
            return BadRequest("Page not found");

        }

        [HttpPost("save")]
        public IActionResult SaveInDraft([FromBody] SaveDto saveDto)
        {
            if (saveDto.Page == null || saveDto.InitialPage == null)
            {
                return BadRequest("Invalid sent data");
            }
            DbPage page = _context.Pages.Find(saveDto.Page.id);
            DbPage updatedPage = new DbPage();
            List<CustomTableContent> drafts = new List<CustomTableContent>();
            List<CustomTableContent> contents = JsonConvert.DeserializeObject<List<CustomTableContent>>(page.contents);
            if (page.drafts != null)
            {
                drafts = JsonConvert.DeserializeObject<List<CustomTableContent>>(page.drafts);
                int oldDraftIndex = drafts.FindIndex(draft => draft.Language == saveDto.InitialPage.contents.First().Language);
                if (oldDraftIndex == -1)
                {
                    drafts.Add(saveDto.Page.contents.First());
                }
                else
                {
                    drafts[oldDraftIndex] = saveDto.Page.contents.First();
                }
                foreach (CustomTableContent draft in drafts)
                {
                    draft.Visibility = saveDto.Page.contents.First().Visibility;
                    draft.Slug = saveDto.Page.contents.First().Slug;
                    draft.Description = saveDto.Page.contents.First().Description;
                }
            }
            else
            {
                drafts.Add(saveDto.Page.contents.First());
                foreach (CustomTableContent content in contents)
                {
                    if (content.Language != saveDto.InitialPage.contents.First().Language)
                    {
                        CustomTableContent customContent = new CustomTableContent {
                            Language = content.Language,
                            Title = content.Title,
                            Widgets = content.Widgets,
                            Visibility = saveDto.Page.contents[0].Visibility,
                            Description = saveDto.Page.contents[0].Description,
                            Slug = saveDto.Page.contents[0].Slug
                        };
                        drafts.Add(customContent);
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
        public IActionResult DeleteFraft([FromBody] DeleteDraftDto deleteDraftDto)
        {
            DbPage page = _context.Pages.Where(page => page.id == deleteDraftDto.id).FirstOrDefault();
            if (page != null)
            {
                page.drafts = null;
                _context.SaveChanges();
                return Ok("Draft correctly deleted");
            }
            return BadRequest("Page not found");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
