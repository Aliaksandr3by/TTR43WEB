using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models.Gipermall
{
    public class DataSend
    {
        /// <summary>
        /// URL товара
        /// </summary>
        public string IdGoods { get; set; }
    }

    [Table("Product")]
    public class Product
    {
        [Key]
        [HiddenInput(DisplayValue = false)]
        [Display(Name = "Id")]
        public int Id { get; set; }

        /// <summary>
        /// "Время"
        /// </summary>
        [Display(Name = "Время")]
        //[Required(ErrorMessage = "Время?")]
        public DateTime Date { get; set; }

        /// <summary>
        /// "Адрес"
        /// </summary>
        [Display(Name = "Адрес")]
        [Required(ErrorMessage = "Адрес?")]
        [Url]
        public string Url { get; set; }

        /// <summary>
        /// "Название"
        /// </summary>
        [Display(Name = "Название?")]
        [Required(ErrorMessage = "Название")]
        //[RegularExpression(@"\w*", ErrorMessage = "Please enter a valid Name")]
        public string Name { get; set; }

        /// <summary>
        /// "Цена"
        /// </summary>
        [Display(Name = "Цена")]
        public decimal? Price { get; set; }

        /// <summary>
        /// "Цена без скидки"
        /// </summary>
        [Display(Name = "Цена без скидки")]
        public decimal? PriceWithoutDiscount { get; set; }

        /// <summary>
        /// "Размерность"
        /// </summary>
        [Display(Name = "Размерность")]
        public string Dimension { get; set; }

        /// <summary>
        /// "Артикул"
        /// </summary>
        [Display(Name = "Артикул")]
        public string MarkingGoods { get; set; }

        /// <summary>
        /// "Штрих-код"
        /// </summary>
        [Display(Name = "Штрих-код")]
        public string BarCode { get; set; }

        /// <summary>
        /// "Страна производства"
        /// </summary>
        [Display(Name = "Страна производства")]
        public string ManufacturingCountry { get; set; }

        /// <summary>
        /// "Торговая марка"
        /// </summary>
        [Display(Name = "Торговая марка")]
        public string Trademark { get; set; }

        /// <summary>
        /// "Масса / Объем"
        /// </summary>
        [Display(Name = "Масса / Объем")]
        public double? Mass { get; set; }

        /// <summary>
        /// Цена за 1 кг
        /// </summary>
        [Display(Name = "Цена за 1 кг")]
        public decimal? PriceForMass { get; set; }

    }
}
