using System;
using System.Collections.Generic;

namespace Model.PageModel.ClickAction
{
    public class BaseClickAction
    {
        public string Url { get; set; }
        public bool External { get; set; }
        public ClickActionType Type { get; set; }
        public string GroupId { get; set; }
        public string GroupValueId { get; set; }
        public string[] GroupValueIds { get; set; }
        public CatalogAction[] Actions { get; set; }
        public string SalesCampaignId { get; set; }
        public string Content { get; set; }
        public string DestinationWidget { get; set; }
    }
}
