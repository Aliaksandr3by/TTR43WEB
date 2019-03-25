USE Product;
GO

SELECT * FROM [dbo].[Products] INNER JOIN [dbo].[Name] ON [Products].[Name] = [Name].id ORDER BY [Name] DESC ;
SELECT * FROM [dbo].[Products] WHERE [MarkingGoods] is NULL;
SELECT * FROM [dbo].[ManufacturingCountry];
SELECT * FROM [dbo].[MarkingGoods] WHERE [MarkingGoodsProduct] = NULL;
SELECT * FROM [dbo].Name WHERE [NameProduct] LIKE N'%Êîôå ìîëîòûé%';

delete from [dbo].[Products] where MarkingGoods is null;

SELECT [Dimension].id FROM [dbo].[Products] left join [dbo].[Dimension] on [Products].[Dimension] = [Dimension].[Dimension];

SELECT * FROM Products INNER JOIN [dbo].[Dimension] on [Products].[Dimension] = [Dimension].[id]
SELECT ID, [MarkingGoods] FROM Products where [MarkingGoods] is null ;
SELECT * FROM Products ORDER BY [Price];

SELECT * FROM Products WHERE [Name] LIKE N'%???? «Paulig Arabica» 1000 ?.%' ORDER BY [PriceOneKilogram];

SELECT * FROM Products WHERE [MarkingGoods] = 95308 AND Url LIKE N'%e-dostavka.by%';

SELECT * FROM Products WHERE [MarkingGoods] = 95308 AND Url LIKE N'%e-dostavka.by%';
SELECT * FROM Products WHERE  [Id] = 318;

--DELETE FROM [dbo].[Products] WHERE [MarkingGoods] is NULL ;
--DELETE FROM [dbo].[Products] WHERE [Name] LIKE N'%?????????%';

--ALTER TABLE [dbo].[Products] ADD [ProductsId] int NULL;

--ALTER TABLE [dbo].[Products] DROP COLUMN  [Dimension_id];  