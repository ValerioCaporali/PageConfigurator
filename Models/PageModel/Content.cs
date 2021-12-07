using System;
using System.Collections.Generic;

namespace Model.PageModel
{
    public class Content
    {
        public string Text { get; set; }
        public string[] Source { get; set; }
        public bool? EnableLoop { get; set; }
        public int SlideShowDelay { get; set; }
        public bool? ServerSideScalingEnabled { get; set; }
        public bool? CacheEnabled { get; set; }
    }
}
