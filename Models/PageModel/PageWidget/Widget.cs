using System;
using System.Collections.Generic;
using Model.PageModel.ClickAction;
using Model.PageModel.PageStyle;

namespace Model.PageModel.PageWidget
{
    public class Widget
    {
        public string Id { get; set; }
        public int Row { get; set; }
        public int MobileRow { get; set; }
        public int RowSpan { get; set; }
        public int Column { get; set; }
        public int ColumnSpan { get; set; }
        public WidgetType Type { get; set; }
        public Content Content { get; set; }
        public Text Text { get; set; }
        public BaseClickAction ClickAction { get; set; }
        public Style Style { get; set; }
        public Style MobileStyle { get; set; }
        public HoverBehaviour Hover { get; set; }
    }
}
