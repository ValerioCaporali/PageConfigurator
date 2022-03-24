using System;
using System.Collections.Generic;
using Model.Page.Contents;
using Model.Page.Type;

namespace API.Model
{
    public class CustomTablePage
    {
        public Guid id { get; set; }
        public PageType type { get; set; }
        public int visibility { get; set; }
        public string slug { get; set; }
        public string description { get; set; }
        public List<CustomTableContent> drafts { get; set; }
        public List<CustomTableContent> contents { get; set; }
    }
}