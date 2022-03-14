using Model.PageModel;

namespace API.DTOs
{
    public class SaveDto
    {
        public Page Page { get; set; }
        public Page InitialPage { get; set; }
    }
}