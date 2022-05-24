using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Model.Page.Contents;
using Model.Page.Type;
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
            List<string> riddenPages = new();
            
            foreach (Page page in homePages)
            {

                if (riddenPages.Contains(page.Name) == false) {
                    riddenPages.Add(page.Name);
                    List<TableContent> jsonContents = new();
                    TableContent jsonContent = new()
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
                            TableContent sameJsonContent = new()  
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
    
                    DbPage bindedPage = new()
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

                if (riddenPages.Contains(page.Name) == false) {
                    riddenPages.Add(page.Name);
                    List<TableContent> jsonContents = new();
                    TableContent jsonContent = new()
                    {
                        Language = page.Language != null ? page.Language : null,
                        Widgets = page.Widgets,
                        Title = page.Name
                    };
    
                    jsonContents.Add(jsonContent);
    
                    foreach (Page pageToCompare in pages)
                    {
                        var index = jsonContents.FindIndex(content => content.Title == pageToCompare.Name && content.Language != pageToCompare.Language);
                        if (index != -1)
                        {
                            TableContent sameJsonContent = new()
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
    
                    DbPage bindedPage = new()
                    {
                        id = Guid.NewGuid(),
                        type = (PageType)1,
                        visibility = 1,
                        slug = "/" + page.Id,
                        description = page.Name.ToString(),
                        contents = jsonStringContents
                    };
                    _context.Pages.Add(bindedPage);
                    }
            }
            await _context.SaveChangesAsync();
            return;
        }
        
    }
}