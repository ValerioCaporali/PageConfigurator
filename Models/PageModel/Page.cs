using System;
using System.Collections.Generic;
using Model.PageModel.PageWidget;

namespace Model.PageModel
{
    public class Page<T>
    {
        public int Kind { get; set; }
        public string Name { get; set; }
        public string Language { get; set; }
        public bool? Default { get; set; }
        public string CustomerGroupValueOid { get; set; }
        public List<Widget<T>> Widgets { get; set; }
    }
}


// prendo il risultato json in stringa -> poi lo deserializzo nel modello che ho creato