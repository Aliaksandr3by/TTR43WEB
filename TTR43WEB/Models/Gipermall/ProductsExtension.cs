using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.productttr43;
using DatumServer.Datum.userttr43;
using TTR43WEB.Models.Product;
using TTR43WEB.Models.User;

namespace TTR43WEB.Models.Gipermall
{
    public static class ProductsExtension
    {
        public static UserLite ToUserLite(this UserLite userEntityLite, Users userEntity)
        {
            if (userEntityLite == null)
            {
                throw new ArgumentNullException(nameof(userEntityLite));
            }

            UserLite _entityLite = new UserLite
            {
                Login = userEntity.Login,
                Email = userEntity.Email,
                TelephoneNumber = userEntity.TelephoneNumber,
                DateTimeRegistration = userEntity.DateTimeRegistration,
                Role = userEntity.Role,
                FirstName = userEntity.FirstName,
                LastName = userEntity.LastName,
            };
            return _entityLite;
        }

        public static ProductEntityLite ToProductEntityLite(this ProductEntityLite productEntityLite, ProductEntity productEntity)
        {
            if (productEntityLite == null)
            {
                throw new ArgumentNullException(nameof(productEntityLite));
            }

            ProductEntityLite _productEntityLite = new ProductEntityLite
            {
                Id = productEntity.Id,
                Date = productEntity.Date,
                Guid = productEntity.Guid,
                Url = productEntity.Url,
                Name = productEntity.Name,
                MarkingGoods = productEntity.MarkingGoods,
                Price = productEntity.Price,
                PriceWithoutDiscount = productEntity.PriceWithoutDiscount,
                PriceOneMass = productEntity.PriceOneKilogram ?? productEntity.PriceOneLiter,
                FullEstimatedValue = getFullPrice(productEntity),
                Mass = productEntity.Mass,
                DimensionProduct = productEntity.Dimension,
            };
            return _productEntityLite;
        }

        public static decimal? getFullPrice(ProductEntity productEntity)
        {
            return getFullPriceDet(productEntity.Price, productEntity.PriceWithoutDiscount, productEntity.Mass, productEntity.PriceOneKilogram, productEntity.PriceOneLiter);

        }

        public static decimal? getFullPrice(Products productEntity)
        {
            return getFullPriceDet(productEntity.Price, productEntity.PriceWithoutDiscount, productEntity.Mass, productEntity.PriceOneKilogram, productEntity.PriceOneLiter);
        }

        private static decimal? getFullPriceDet(decimal? Price, decimal? PriceWithoutDiscount, double? Mass, decimal? PriceOneKilogram, decimal? PriceOneLiter)
        {
            decimal fullSize = 1.0M;

            if ((Price != null || PriceWithoutDiscount != null) && Mass != null)
            {
                var tmp = (Price ?? PriceWithoutDiscount) / (decimal) Mass * fullSize;
                return Math.Round(tmp ?? 0, 3);
            }
            else
            {
                return PriceOneKilogram ?? PriceOneLiter;
            }
        }

        public static ProductEntityLite ToProductEntityLite(this ProductEntityLite productEntityLite, Products productEntity)
        {
            if (productEntityLite == null)
            {
                throw new ArgumentNullException(nameof(productEntityLite));
            }

            ProductEntityLite _productEntityLite = new ProductEntityLite
            {
                Id = productEntity.Id,
                Date = productEntity.Date,
                Guid = productEntity.Guid,
                Url = productEntity.UrlNavigation?.UrlProduct,
                Name = productEntity.NameNavigation?.NameProduct,
                MarkingGoods = productEntity.MarkingGoods,
                Price = productEntity.Price,
                PriceWithoutDiscount = productEntity.PriceWithoutDiscount,
                PriceOneMass = productEntity.PriceOneKilogram ?? productEntity.PriceOneLiter,
                FullEstimatedValue = getFullPrice(productEntity),
                Mass = productEntity.Mass,
                DimensionProduct = productEntity.DimensionNavigation?.DimensionProduct,
            };

            return _productEntityLite;
        }

        public static Products ToProducts(this Products products, ProductEntity product, productttr43Context context)
        {
            if (products == null)
            {
                throw new ArgumentNullException(nameof(products));
            }

            var _products = new Products();

            //[Date]
            _products.Date = product.Date;
            //[Url]
            if (product.Url != null && !context.Url.Any(e => e.UrlProduct == product.Url))
            {
                context.Url.Add(new Url { UrlProduct = product.Url });
                context.SaveChanges();
            }
            _products.Url = context.Url.FirstOrDefault(e => e.UrlProduct == product.Url)?.Id ?? default;
            //[Name]
            if (product.Name != null && !context.Name.Any(e => e.NameProduct == product.Name))
            {
                context.Name.Add(new Name { NameProduct = product.Name });
                context.SaveChanges();
            }
            _products.Name = context.Name.FirstOrDefault(e => e.NameProduct == product.Name)?.Id;
            //[MarkingGoods]
            if (product.MarkingGoods != null && !context.MarkingGoods.Any(e => e.MarkingGoodsProduct == product.MarkingGoods))
            {
                context.MarkingGoods.Add(new MarkingGoods { MarkingGoodsProduct = product.MarkingGoods ?? default });
                context.SaveChanges();
            }
            _products.MarkingGoods = context.MarkingGoods.FirstOrDefault(e => e.MarkingGoodsProduct == product.MarkingGoods)?.Id;
            //[Price]
            _products.Price = product.Price;
            //[PriceWithoutDiscount]
            _products.PriceWithoutDiscount = product.PriceWithoutDiscount;
            //[PriceOneKilogram]
            _products.PriceOneKilogram = product.PriceOneKilogram;
            //[PriceOneLiter]
            _products.PriceOneLiter = product.PriceOneLiter;
            //[Mass]
            _products.Mass = product.Mass;
            //[Dimension]
            if (product.Dimension != null && !context.Dimension.Any(e => e.DimensionProduct == product.Dimension))
            {
                context.Dimension.Add(new Dimension { DimensionProduct = product.Dimension ?? default });
                context.SaveChanges();
            }
            _products.Dimension = context.Dimension.FirstOrDefault(e => e.DimensionProduct == product.Dimension)?.Id;
            //[BarCode]
            if (product.BarCode != null && !context.BarCode.Any(e => e.BarCodeProduct == product.BarCode))
            {
                context.BarCode.Add(new BarCode { BarCodeProduct = product.BarCode });
                context.SaveChanges();
            }
            _products.BarCode = context.BarCode.FirstOrDefault(e => e.BarCodeProduct == product.BarCode)?.Id;
            //[ManufacturingCountry]
            if (product.ManufacturingCountry != null && !context.ManufacturingCountry.Any(e => e.ManufacturingCountryProduct == product.ManufacturingCountry))
            {
                context.ManufacturingCountry.Add(new ManufacturingCountry { ManufacturingCountryProduct = product.ManufacturingCountry ?? default });
                context.SaveChanges();
            }
            _products.ManufacturingCountry = context.ManufacturingCountry.FirstOrDefault(e => e.ManufacturingCountryProduct == product.ManufacturingCountry)?.Id;
            //[Trademark]
            if (product.Trademark != null && !context.Trademark.Any(e => e.TrademarkProduct == product.Trademark))
            {
                context.Trademark.Add(new Trademark { TrademarkProduct = product.Trademark ?? default });
                context.SaveChanges();
            }
            _products.Trademark = context.Trademark.FirstOrDefault(e => e.TrademarkProduct == product.Trademark)?.Id;

            return _products;
        }
    }

}