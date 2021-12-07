using System;
using System.Collections.Generic;

namespace Model.PageModel.PageWidget.WidgetContent
{
    public class GalleryConfiguration : BaseMediaConfiguration
    {
        public bool ShowIndicator { get; set; }
        public bool ShowNavButtons { get; set; }
        public bool EnableLoop { get; set; }
        public int SlideShowDelay { get; set; }
        public bool ServerSideScalingEnabled { get; set; }
        public bool CacheEnabled { get; set; }
    }
}
