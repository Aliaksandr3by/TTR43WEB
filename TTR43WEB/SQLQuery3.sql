USE [User];
GO  
BACKUP DATABASE [User] TO DISK = 'F:\Documents\sql_backup';
GO

--[Users]
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE [dbo].[Users];
CREATE TABLE [dbo].[Users]
(
	[Guid] uniqueidentifier NOT NULL DEFAULT(newid()) PRIMARY KEY,
	Login NVARCHAR(MAX) NOT NULL ,
	Email NVARCHAR(MAX) NOT NULL,
	TelephoneNumber int NOT NULL,
	Password NVARCHAR(MAX) NOT NULL,
	PasswordConfirm NVARCHAR(MAX) NOT NULL,
	DateTimeRegistration datetime NOT NULL,
);
ALTER TABLE [dbo].[Users] ADD CONSTRAINT UNQ_TelephoneNumber UNIQUE(TelephoneNumber);
INSERT INTO [dbo].[Users]([Login], [Email], [TelephoneNumber], [Password], [PasswordConfirm], [DateTimeRegistration]) VALUES (N'ADMIN', N'ADMIN', 0, N'ADMIN', N'ADMIN', GETDATE ())
SELECT * FROM [dbo].[Users]