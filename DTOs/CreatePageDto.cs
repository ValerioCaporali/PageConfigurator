using System;
using API.Model;
using Model.Page.Type;
using Model.PageModel;

namespace API.DTOs
{
    public class CreatePageDto
    {
        public PageType Type { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
    }
}