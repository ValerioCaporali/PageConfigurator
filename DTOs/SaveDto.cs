using API.Model;
using Model.PageModel;

namespace API.DTOs
{
    public class SaveDto
    {
        public CustomTablePage Page { get; set; }
        public CustomTablePage InitialPage { get; set; }
    }
}