using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models
{
    public class DataSend
    {
        /// <summary>
        /// URL товара
        /// </summary>
        public string[] value { get; set; }
    }
    public class Product
    {
        public List<string> Products { get; } = new List<string>() {
                "Название",
                "Цена",
                "Цена без скидки",
                "Размерность",
                "Артикул",
                "Штрих-код",
                "Страна производства",
                "Торговая марка",
                "Масса / Объем",
                "Цена за 1 кг"
            };

        public Product()
        {

        }

        [HiddenInput(DisplayValue = false)]
        [Display(Name = "Id")]
        public int Id { get; set; }

        [Display(Name = "Название")]
        [Required(ErrorMessage = "Название")]
        //[RegularExpression(@"\w*", ErrorMessage = "Please enter a valid Name")]
        public string Name { get; set; }

        [Display(Name = "Цена")]
        public decimal? Сost { get; set; }

        [Display(Name = "Цена без скидки")]
        public decimal? PriceWithoutDiscount { get; set; }

        [Display(Name = "Размерность")]
        public string Dimension { get; set; }

        [Display(Name = "Артикул")]
        public string MarkingGoods { get; set; }

        [Display(Name = "Штрих-код")]
        public string BarCode { get; set; }

        [Display(Name = "Страна производства")]
        public string ManufacturingCountry { get; set; }

        [Display(Name = "Торговая марка")]
        public string Trademark { get; set; }

        [Display(Name = "Масса / Объем")]
        public double? Mass { get; set; }

        [Display(Name = " Цена за 1 кг")]
        public decimal? PriceForMass { get; set; }

    }
}
