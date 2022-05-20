using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Infrastructure;
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
using Microsoft.AspNetCore.Diagnostics;
using Model.Page.Contents;
using Model.Page.Type;
using Model.PageModel.PageWidget;

namespace Pages_configurator.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class PagesController : Controller
    {
        private readonly ILogger<PagesController> _logger;
        private readonly IBindingService _bindingService;
        private readonly DataContext _context;

        public PagesController(ILogger<PagesController> logger, IBindingService bindingService, DataContext context)
        {
            _logger = logger;
            _bindingService = bindingService;
            _context = context;
        }
        
        [Route("~/pages/{id}/{language}")]
        public ActionResult Index(Guid id, string language)
        {
            return View();
        }

        [HttpGet("get-all/{type?}")]
        public async Task<ActionResult<List<CustomTablePage>>> GetAll(int? type)
        {
            await _bindingService.BindPagesFromJsonAsync();

            List<CustomTablePage> pages = new();
            List<DbPage> dbPages = _context.Pages.ToList();
            
            if (type == 0 || type == 1)
            {
                foreach (DbPage dbPage in dbPages)
                {
                    if (dbPage.type == (PageType) 1)
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
                }
            }
            else
            {
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
            }

            return pages;
        }
        
        [HttpPost("get")]
        public async Task<ActionResult<CustomTablePage>> Get(PageDto pageDto)
        {
            DbPage dbPage = _context.Pages.Find(pageDto.Id);
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

            return page;
        }
        
        
        [HttpPost("publish")]
        public IActionResult SavePage([FromBody] PublishDto publishDto)
        {

            DbPage page = _context.Pages.Find(publishDto.id);
            
            if (page == null) return BadRequest("Page not found");
            
            List<CustomTableContent> drafts = JsonConvert.DeserializeObject<List<CustomTableContent>>(page.drafts);
            page.visibility = drafts[0].Visibility;
            page.description = drafts[0].Description;
            page.slug = drafts[0].Slug;
            List<TableContent> contents = drafts.Select(draft => new TableContent {Language = draft.Language, Title = draft.Title, Widgets = draft.Widgets}).ToList();
            page.contents = JsonConvert.SerializeObject(contents);
            page.drafts = null;
            _context.SaveChanges();
            return Ok("Page correctly published");

        }

        [HttpPost("save")]
        public IActionResult SaveInDraft(SaveDto saveDto)
        {
            if (saveDto.Page == null || saveDto.InitialPage == null)
            {
                return BadRequest("Invalid sent data");
            }
            DbPage page = _context.Pages.Find(saveDto.Page.id);
            DbPage updatedPage = new();
            List<CustomTableContent> drafts = new();
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
                drafts.AddRange(from content in contents
                where content.Language != saveDto.InitialPage.contents.First().Language
                select new CustomTableContent
                {
                    Language = content.Language,
                    Title = content.Title,
                    Widgets = content.Widgets,
                    Visibility = saveDto.Page.contents[0].Visibility,
                    Description = saveDto.Page.contents[0].Description,
                    Slug = saveDto.Page.contents[0].Slug
                });
            }

            updatedPage = page;
            updatedPage.drafts = JsonConvert.SerializeObject(drafts);
            _context.Entry(page).CurrentValues.SetValues(updatedPage);
            _context.SaveChanges();
            return Ok("Page correctly saved");
        }

        [HttpPost("delete-draft")]
        public IActionResult DeleteDraft([FromBody] DeleteDraftDto deleteDraftDto)
        {
            DbPage page = _context.Pages.FirstOrDefault(page => page.id == deleteDraftDto.id);
            if (page == null) return BadRequest("Page not found");
            page.drafts = null;
            _context.SaveChanges();
            return Ok("Draft correctly deleted");
        }

        [HttpPost("delete-page")]
        public IActionResult DeletePage([FromBody] DeletePageDto deletePageDto)
        {
            DbPage page = _context.Pages.FirstOrDefault(page => page.id == deletePageDto.id);
            if (page == null) return BadRequest("Page not found");
            _context.Pages.Remove(page);
            _context.SaveChanges();
            return Ok("Page correctly deleted");
        }

        [HttpPost("create")]
        public ActionResult<CustomTablePage> CreatePage([FromBody] CreatePageDto createPageDto)
        {
            TableContent content = new TableContent
            {
                Widgets = new List<Model.PageModel.PageWidget.Widget>(),
                Title = "",
                Language = null
            };
            List<TableContent> contents = new() {content};
            string serializedContents = JsonConvert.SerializeObject(contents);
            DbPage newPage = new DbPage
            {
                id = Guid.NewGuid(),
                type = (PageType) createPageDto.Type,
                visibility = 1,
                slug = "/" + createPageDto.Slug,
                description = createPageDto.Description,
                contents = serializedContents
            };

            CustomTablePage page = new()
            {
                id = newPage.id,
                type = newPage.type,
                visibility = newPage.visibility,
                slug = newPage.slug,
                description = newPage.description,
                drafts = newPage.drafts != null ? JsonConvert.DeserializeObject<List<CustomTableContent>>(newPage.drafts) : null,
                contents = JsonConvert.DeserializeObject<List<CustomTableContent>>(newPage.contents)
            };

            page.contents[0].Description = page.description;
            page.contents[0].Visibility = page.visibility;
            page.contents[0].Slug = page.slug;
            
            _context.Pages.Add(newPage);
            _context.SaveChanges();
            return page;
        }

        [HttpPost("new-language")]
        public async Task<ActionResult<CustomTablePage>> CreateLanguage([FromBody] NewLanguageDto newLanguageDto)
        {
            if (!_context.Pages.Any(page => page.id == newLanguageDto.Id)) return BadRequest("Page not found");
            DbPage page = _context.Pages.Find(newLanguageDto.Id);
            List<TableContent> pageContents = JsonConvert.DeserializeObject<List<TableContent>>(page.contents);
            if (pageContents.Any(content => content.Language == newLanguageDto.Language)) return BadRequest("Language already exists");
            TableContent newContent = new()
            {
                Language = newLanguageDto.Language,
                Title = pageContents.First().Title,
                Widgets = newLanguageDto.Duplicate ? pageContents.First().Widgets : new List<Widget>()
            };
            pageContents.Add(newContent);
            page.contents = JsonConvert.SerializeObject(pageContents);
            CustomTablePage customPage = new CustomTablePage
            {
                id = page.id,
                type = page.type,
                visibility = page.visibility,
                slug = page.slug,
                description = page.description,
                drafts = page.drafts != null ? JsonConvert.DeserializeObject<List<CustomTableContent>>(page.drafts) : null,
                contents = JsonConvert.DeserializeObject<List<CustomTableContent>>(page.contents)
            };
            try
            {
                _context.Entry(page).Property("contents").IsModified = true;
                await _context.SaveChangesAsync();
                return customPage;

            }
            catch (DbUpdateException e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpDelete("delete-language")]
        public ActionResult DeleteLanguage([FromBody] DeleteLanguageDto deleteLanguageDto)
        {
            if (!_context.Pages.Any(page => page.id == deleteLanguageDto.Id)) return BadRequest("Page not found");
            DbPage page = _context.Pages.Find(deleteLanguageDto.Id);
            List<TableContent> pageContents = JsonConvert.DeserializeObject<List<TableContent>>(page.contents);
            if (!pageContents.Any(content => content.Language == deleteLanguageDto.Language)) return BadRequest("Page not found");
            pageContents.Remove(pageContents.Find(content => content.Language == deleteLanguageDto.Language));
            page.contents = JsonConvert.SerializeObject(pageContents);
            try
            {
                _context.Entry(page).Property("contents").IsModified = true;
                _context.SaveChanges();
                return Ok("New language correctly created");

            }
            catch (DbUpdateException e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        // [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        // public IActionResult Error()
        // {
        //     return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        // }
    }
}
