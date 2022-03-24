using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Model.PageModel.PageWidget;

namespace Model.PageModel
{
    public class BaseContent : Widget
    {
        public Content Content { get; set; }
    }
}