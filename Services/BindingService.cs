using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Model.Content.Language;
using Model.Page;
using Model.Page.Contents;
using Model.PageModel;
using Newtonsoft.Json;

namespace API.Service
{
    public class BindingService : IBindingService
    {

        private DataContext _context;
        public BindingService(DataContext context)
        {
            _context = context;
        }

        public async Task BindPagesFromJsonAsync()
        {

            if (_context.Pages.Count() != 0)
                return;
                
            var pagesJson = await System.IO.File.ReadAllTextAsync("Pages/pages.json");
            List<Page> pages = JsonConvert.DeserializeObject<List<Page>>(pagesJson);

            var homePagesJson = await System.IO.File.ReadAllTextAsync("Pages/home.json");
            List<Page> homePages = JsonConvert.DeserializeObject<List<Page>>(homePagesJson);
            List<string> riddenPages = new List<string>();
            
            foreach (Page page in homePages)
            {
                var len = page.Language != null ? page.Language : null;

                if (riddenPages.Contains(page.Name) == false) {
                    riddenPages.Add(page.Name);
                    List<TableContent> jsonContents = new List<TableContent>();
                    TableContent jsonContent = new TableContent
                    {
                        Language = page.Language,
                        Widgets = page.Widgets,
                        Title = page.Name
                    };
    
                    jsonContents.Add(jsonContent);
    
                    foreach (Page homePageToCompare in homePages)
                    {
                        var index = jsonContents.FindIndex(content => content.Title == homePageToCompare.Name && content.Language != homePageToCompare.Language);
                        if (index != -1)
                        {
                            TableContent sameJsonContent = new TableContent  
                            {
                                Language = homePageToCompare.Language,
                                Widgets = homePageToCompare.Widgets,
                                Title = homePageToCompare.Name
                            };
                            jsonContents.Add(sameJsonContent);
                        }

                    }

                    var fallbackContent = jsonContents.Where(content => content.Language == null);
                    if (!fallbackContent.Any())
                    {
                        int enContentIndex = jsonContents.FindIndex(content => content.Language == "en");
                        int itContentIndex = jsonContents.FindIndex(content => content.Language == "it");
                        if (enContentIndex != -1)
                        {
                            jsonContents[enContentIndex].Language = null;
                        }
                        else if (itContentIndex != -1)
                        {
                            jsonContents[itContentIndex].Language = null;
                        }
                        else
                        {
                            jsonContents[0].Language = null;
                        }

                    }
                    
                    string jsonStringContents = JsonConvert.SerializeObject(jsonContents);
    
                    DbPage bindedPage = new DbPage
                    {
                        id = Guid.NewGuid(),
                        type = 0,
                        visibility = 1,
                        slug = null,
                        description = page.Name.ToString(),
                        contents = jsonStringContents
                    };
                    _context.Pages.Add(bindedPage);
                    }
            }

            riddenPages = new List<string>();
            
            foreach (Page page in pages)
            {
                var len = page.Language != null ? page.Language : null;

                if (riddenPages.Contains(page.Name) == false) {
                    riddenPages.Add(page.Name);
                    List<TableContent> jsonContents = new List<TableContent>();
                    TableContent jsonContent = new TableContent
                    {
                        Language = page.Language != null ? page.Language : null,
                        Widgets = page.Widgets,
                        Title = page.Name
                    };
    
                    jsonContents.Add(jsonContent);
    
                    foreach (Page pageToCompare in pages)
                    {
                        var lenToCompare = pageToCompare.Language != null ? pageToCompare.Language : null;
                        var index = jsonContents.FindIndex(content => content.Title == pageToCompare.Name && content.Language != pageToCompare.Language);
                        if (index != -1)
                        {
                            TableContent sameJsonContent = new TableContent
                            {
                                Language = pageToCompare.Language,
                                Widgets = pageToCompare.Widgets,
                                Title = pageToCompare.Name
                            };

                            jsonContents.Add(sameJsonContent);
                        }

                    }

                    var fallbackContent = jsonContents.Where(content => content.Language == null);
                        if (!fallbackContent.Any())
                        {
                            int enContentIndex = jsonContents.FindIndex(content => content.Language == "en");
                            int itContentIndex = jsonContents.FindIndex(content => content.Language == "it");
                            if (enContentIndex != -1)
                            {
                                jsonContents[enContentIndex].Language = null;
                            }
                            else if (itContentIndex != -1)
                            {
                                jsonContents[itContentIndex].Language = null;
                            }
                            else
                            {
                                jsonContents[0].Language = null;
                            }
                        }
                    
                    string jsonStringContents = JsonConvert.SerializeObject(jsonContents);
    
                    DbPage bindedPage = new DbPage
                    {
                        id = Guid.NewGuid(),
                        type = (global::Model.Page.Type.PageType)1,
                        visibility = 1,
                        slug = "/" + page.Id,
                        description = page.Name.ToString(),
                        contents = jsonStringContents
                    };
                    _context.Pages.Add(bindedPage);
                    }
            }
            _context.SaveChanges();
            return;
        }
        
    }
}