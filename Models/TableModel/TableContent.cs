using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Model.Content.Language;
using Model.PageModel.PageWidget;

namespace Model.Page.Contents
{
    
    [Keyless]
    public class TableContent
    {
        public string? Language { get; set; }
        public string Title { get; set; }
        public List<Widget> Widgets { get; set; }
    }
}