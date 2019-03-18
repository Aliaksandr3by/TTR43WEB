using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TTR43WEB.Datum;

namespace TTR43WEB.Models.Gipermall
{
    public static class ProductsExtension
    {
        public static Products ToProducts(this Products products, Product product, ProductContext context)
        {
            if (products == null)
            {
                throw new ArgumentNullException(nameof(products));
            }

            /*
            [Id], 
            [Date], 
            [Url], 
            [Name], 
            [MarkingGoods], 
            [Price], 
            [PriceWithoutDiscount], 
            [PriceOneKilogram], 
            [PriceOneLiter], 
            [Mass], 
            [Dimension], 
            [BarCode], 
            [ManufacturingCountry], 
            [Trademark]
            */
            var _products = new Products();

            if (product.BarCode != null && context.BarCode.Any(e => e.BarCodeProduct == product.BarCode))
            {
                context.BarCode.Add(new BarCode { BarCodeProduct = product.BarCode });
                context.SaveChanges();
            }

            _products.BarCode = context.BarCode.FirstOrDefault(e => e.BarCodeProduct == product.BarCode).Id;

            _products.Date = product.Date;

            if (product.Url != null && context.Url.Any(e => e.UrlProduct == product.Url))
            {
                context.Url.Add(new Url { UrlProduct = product.Url });
                context.SaveChanges();
            }

            _products.Url = context.Url.FirstOrDefault(e => e.UrlProduct == product.Url).Id;




            return null;
        }
    }

}
