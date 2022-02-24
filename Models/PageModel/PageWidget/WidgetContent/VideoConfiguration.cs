using System;
using System.Collections.Generic;

namespace Model.PageModel.PageWidget.WidgetContent
{
    public class VideoConfiguration : BaseMediaConfiguration
    {
        public string Width { get; set; }
        public string Height { get; set; }
        public bool EnableLoop { get; set; }
        public bool EnableAutoplay { get; set; }
        public bool DisableControls { get; set; }
        public bool Responsive { get; set; }
    }
}
