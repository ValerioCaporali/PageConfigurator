using System;
using Model.Page.Type;

namespace API.Entities
{
    public class TablePage
    {
        public Guid id { get; set; }
        public PageType type { get; set; }
        public int visibility { get; set; }
        public string slug { get; set; }
        public string description { get; set; }
        public string contents { get; set; }
    }
}