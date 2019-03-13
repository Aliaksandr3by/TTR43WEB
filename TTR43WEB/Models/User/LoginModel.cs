using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TTR43WEB.Models.User
{
    public class LoginModel
    {
        [Key]
        [HiddenInput(DisplayValue = false)]
        [Display(Name = "Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Не указан Login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Не указан пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
