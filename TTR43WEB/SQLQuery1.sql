USE [Product];
GO  
BACKUP DATABASE [Product] TO DISK = 'F:\Documents\sql_backup';
GO

drop table [dbo].[Dimension];
ALTER TABLE [dbo].[Dimension] ADD CONSTRAINT PK_Dimension PRIMARY KEY(id);
ALTER TABLE [dbo].[Dimension] ADD CONSTRAINT UNQ_Dimension_Dimension UNIQUE(Dimension);


ALTER TABLE [dbo].[Products] ALTER COLUMN [GUID] uniqueidentifier NULL ; 
ALTER TABLE [dbo].[Products] ADD [GUID] uniqueidentifier NULL; --дебавляем столбец гуид,
ALTER TABLE [dbo].[Products] ADD CONSTRAINT DFT_Products_GUID DEFAULT(newid()) FOR [GUID]; -- заносим дефолтное значение , которое будет при создации
UPDATE [dbo].[Products] SET [GUID] = newid();  --заносим данные в столбец гуид


CREATE TABLE [dbo].[Dimension]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Dimension NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[Dimension](Dimension) SELECT DISTINCT Dimension FROM [Products] WHERE Dimension is not NULL
UPDATE [Products] SET [Products].[Dimension] = (SELECT [dbo].[Dimension].id FROM [dbo].[Dimension] WHERE [dbo].[Products].[Dimension] = [dbo].[Dimension].[Dimension])
SELECT * FROM [dbo].[Dimension]

/*[Name]*/
CREATE TABLE [dbo].[Name]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Name NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[Name](Name) SELECT DISTINCT [Name] FROM [Products] WHERE Name is not NULL
UPDATE [Products] SET [Products].[Name] = (SELECT [dbo].[Name].id FROM [dbo].[Name] WHERE [dbo].[Products].[Name] = [dbo].[Name].[Name])
ALTER TABLE [dbo].[Products] ALTER COLUMN [Name] INT NULL; 
SELECT * FROM [dbo].[Name]

/*[BarCode]*/
CREATE TABLE [dbo].[BarCode]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[BarCode] NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[BarCode](BarCode) SELECT DISTINCT [BarCode] FROM [Products] WHERE [BarCode] is not NULL
UPDATE [Products] SET [Products].[BarCode] = (SELECT [dbo].[BarCode].id FROM [dbo].[BarCode] WHERE [dbo].[Products].[BarCode] = [dbo].[BarCode].[BarCode])
ALTER TABLE [dbo].[Products] ALTER COLUMN [BarCode] INT NULL; 
SELECT * FROM [dbo].[BarCode]

/*[ManufacturingCountry]*/
CREATE TABLE [dbo].[ManufacturingCountry]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[ManufacturingCountry] NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[ManufacturingCountry]([ManufacturingCountry]) SELECT DISTINCT [ManufacturingCountry] FROM [Products] WHERE [ManufacturingCountry] is not NULL
UPDATE [Products] SET [Products].[ManufacturingCountry] = (SELECT [dbo].[ManufacturingCountry].id FROM [dbo].[ManufacturingCountry] WHERE [dbo].[Products].[ManufacturingCountry] = [dbo].[ManufacturingCountry].[ManufacturingCountry])
ALTER TABLE [dbo].[Products] ALTER COLUMN [ManufacturingCountry] INT NULL; 
SELECT * FROM [dbo].[ManufacturingCountry]

/*[Trademark]*/
CREATE TABLE [dbo].[Trademark]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[Trademark] NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[Trademark]([Trademark]) SELECT DISTINCT [Trademark] FROM [Products] WHERE [Trademark] is not NULL
UPDATE [Products] SET [Products].[Trademark] = (SELECT [dbo].[Trademark].id FROM [dbo].[Trademark] WHERE [dbo].[Products].[Trademark] = [dbo].[Trademark].[Trademark])
ALTER TABLE [dbo].[Products] ALTER COLUMN [Trademark] INT NULL; 
SELECT * FROM [dbo].[Trademark]

/*[Url]*/
CREATE TABLE [dbo].[Url]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[Url] NVARCHAR(MAX) NOT NULL,
);
INSERT INTO [dbo].[Url]([Url]) SELECT DISTINCT [Url] FROM [Products] WHERE [Url] is not NULL
UPDATE [Products] SET [Products].[Url] = (SELECT [dbo].[Url].id FROM [dbo].[Url] WHERE [dbo].[Products].[Url] = [dbo].[Url].[Url])
ALTER TABLE [dbo].[Products] ALTER COLUMN [Url] INT NULL; 
SELECT * FROM [dbo].[Url]

/*[MarkingGoods]*/
CREATE TABLE [dbo].[MarkingGoods]
(
	id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[MarkingGoods] INT NOT NULL,
);
INSERT INTO [dbo].[MarkingGoods]([MarkingGoods]) SELECT DISTINCT [MarkingGoods] FROM [Products] WHERE [MarkingGoods] is not NULL
UPDATE [Products] SET [Products].[MarkingGoods] = (SELECT [dbo].[MarkingGoods].id FROM [dbo].[MarkingGoods] WHERE [dbo].[Products].[MarkingGoods] = [dbo].[MarkingGoods].[MarkingGoods])
ALTER TABLE [dbo].[Products] ALTER COLUMN [MarkingGoods] INT NULL; 
SELECT * FROM [dbo].[MarkingGoods]