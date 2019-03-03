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

        //public IEnumerator GetEnumerator()
        //{
        //    foreach (var item in idGoods)
        //    {
        //        yield return $@"https://gipermall.by/catalog/item_{idGoods}.html";
        //    }
        //}
    }

    [Table("Product")]
    public class Product
    {
        [Key]
        [HiddenInput(DisplayValue = false)]
        [Display(Name = "Id")]
        public int Id { get; set; }

        [Display(Name = "Время")]
        //[Required(ErrorMessage = "Время?")]
        public DateTime Date { get; set; }

        [Display(Name = "Адрес")]
        [Required(ErrorMessage = "Адрес?")]
        [Url]
        public string Url { get; set; }

        [Display(Name = "Название?")]
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
