﻿using System;
using System.ComponentModel.DataAnnotations;

namespace TTR43WEB.Models.User
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Не указан Login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Не указан Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Не указан пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Пароль введен неверно")]
        public string PasswordConfirm { get; set; }

        [Required(ErrorMessage = "Не указан Login")]
        public int TelephoneNumber { get; set; }

        public string Role { get; set; }

        public DateTime DateTimeRegistration { get; set; } = DateTime.Now;

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
