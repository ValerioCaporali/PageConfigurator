using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Model.Content.Language;
using Model.PageModel.PageWidget;

namespace Model.Page.Contents
{
    
    [Keyless]
    public class CustomTableContent
    {
        public string? Language { get; set; }
        public string Title { get; set; }
        public int Visibility { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public List<Widget> Widgets { get; set; }
    }
}