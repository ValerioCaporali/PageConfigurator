using System;
using System.Collections.Generic;
using Model.PageModel.PageWidget;

namespace Model.PageModel
{
    public class Page
    {
        public string Id { get; set; }
        public int Kind { get; set; }
        public string Name { get; set; }
        public string? Language { get; set; }
        public bool? Default { get; set; }
        public string CustomerGroupValueOid { get; set; }
        public List<Widget> Widgets { get; set; }
    }
}