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
    //[Table("ProductEntity")]
    public class ProductEntity
    {
        [HiddenInput(DisplayValue = false)]
        public int Id { get; set; }

        [Key]
        [HiddenInput(DisplayValue = false)]
        public Guid Guid { get; set; }

        /// <summary>
        /// "Время"
        /// </summary>
        [Display(Name = "Время")]
        [Required(ErrorMessage = "Время?")]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        /// <summary>
        /// "Адрес"
        /// </summary>
        [Display(Name = "Адрес")]
        [Required(ErrorMessage = "Адрес?")]
        [Url]
        [DataType(DataType.Url)]
        public string Url { get; set; }

        /// <summary>
        /// "Название"
        /// </summary>
        [Display(Name = "Название", Description = "Название товара")]
        [Required(ErrorMessage = "Название")]
        //[RegularExpression(@"\w*", ErrorMessage = "Please enter a valid Name")]
        public string Name { get; set; }

        /// <summary>
        /// "Артикул"
        /// </summary>
        [Display(Name = "Артикул")]
        public int? MarkingGoods { get; set; }

        /// <summary>
        /// "Цена"
        /// </summary>
        [Display(Name = "Цена")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        /// <summary>
        /// "Цена без скидки"
        /// </summary>
        [Display(Name = "Цена без скидки")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PriceWithoutDiscount { get; set; }

        /// <summary>
        /// Цена за 1 кг
        /// </summary>
        [Display(Name = "Цена за 1 кг")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PriceOneKilogram { get; set; }

        /// <summary>
        /// Цена за 1 л
        /// </summary>
        [Display(Name = "Цена за 1 л")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PriceOneLiter { get; set; }

        /// <summary>
        /// "Размерность"
        /// </summary>
        [Display(Name = "Размерность")]
        public string Dimension { get; set; }

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
    }
}
