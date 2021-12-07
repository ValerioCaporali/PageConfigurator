using System;
using System.Collections.Generic;

namespace Model.PageModel.PageStyle
{
    public class Style
    {
        public string Height { get; set; }
        public string Width { get; set; }
        public SpaceProperty Margin { get; set; }
        public string Background { get; set; }
        public string TextColor { get; set; } 
        public string FontFamily { get; set; }
        public string FontSize { get; set; }
        public SpaceProperty Padding { get; set; }
        public BorderProperty Borders { get; set; }
    }
}
