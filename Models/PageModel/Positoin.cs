using System;
using System.Collections.Generic;

namespace Model.PageModel
{
    public class Position
    {
        public PositionType? Type { get; set; }
        public int? Top { get; set; }
        public int? Bottom { get; set; }
        public int? Right { get; set; }
        public int? Left { get; set; }
    }
}
