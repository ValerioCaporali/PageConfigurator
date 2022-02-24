using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
// using Converter;

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
        public bool ShowIndicator { get; set; }
        public bool ShowNavButtons { get; set; }
        public string ShowcaseId { get; set; }
        public string Options { get; set; }
        public bool EnableAutoplay { get; set; }
        public bool DisableControls { get; set; }
        public bool Responsive { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int Zoom { get; set; }
        public string Styles { get; set; }
        public string Icon { get; set; }

    }
}
