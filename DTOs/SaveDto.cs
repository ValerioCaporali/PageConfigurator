using API.Model;
using Model.PageModel;

namespace API.DTOs
{
    public class SaveDto
    {
        public TablePage Page { get; set; }
        public TablePage InitialPage { get; set; }
    }
}