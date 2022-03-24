using System;
using System.Collections.Generic;

namespace Model.PageModel.PageWidget.WidgetContent
{
    public class MapConfiguration : Content
    {
        
        public int Latitude { get; set; }
        public int Longitude { get; set; }
        public int Zoom { get; set; }
        public string Styles { get; set; }
        public string Icon { get; set; }

    }
}
