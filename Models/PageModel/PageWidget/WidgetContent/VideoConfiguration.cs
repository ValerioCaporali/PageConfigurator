using System;
using System.Collections.Generic;

namespace Model.PageModel.PageWidget.WidgetContent
{
    public class VideoConfiguration<T>
    {
        public T Width { get; set; }
        public T Height { get; set; }
        public bool EnableLoop { get; set; }
        public bool EnableAutoplay { get; set; }
        public bool DisableControls { get; set; }
        public bool Responsive { get; set; }
    }
}
