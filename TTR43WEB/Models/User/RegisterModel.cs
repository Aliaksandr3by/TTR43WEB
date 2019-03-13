using System.ComponentModel.DataAnnotations;

namespace TTR43WEB.Models.User
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Не указан Login")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Не указан пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Пароль введен неверно")]
        public string ConfirmPassword { get; set; }
    }
}
