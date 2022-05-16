using System;
using Model.Content.Language;

namespace API.DTOs
{
    public class NewLanguageDto
    {
        public Guid Id { get; set; }
        public bool Duplicate { get; set; }
        public string Language { get; set; }
    }
}