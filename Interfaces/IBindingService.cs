using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Model.Page.Contents;
using Model.PageModel;

namespace API.Interfaces
{
    public interface IBindingService
    {
        Task BindPagesFromJsonAsync(); // to bind page from json to table structure
        
    }
}