using System;
using System.Collections.Generic;

namespace Model.PageModel.ClickAction
{
    public class CatalogAction : BaseClickAction
    {
        public string GroupId { get; set; }
        public string GroupValueId { get; set; }
        public string[] GroupValueIds { get; set; }
    }
}
