using System;
using System.Collections.Generic;
using Model.Page.Contents;
using Model.Page.Type;

namespace API.Model
{
    public class TablePage
    {
        public Guid id { get; set; }
        public PageType type { get; set; }
        public int visibility { get; set; }
        public string slug { get; set; }
        public string description { get; set; }
        public TableContent Draft { get; set; }
        public List<TableContent> contents { get; set; }
    }
}