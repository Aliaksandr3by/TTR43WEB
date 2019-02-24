using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;

namespace TTR43WEB.Data
{
    public class EFTable : ITable
    {
        private readonly DataContext context;

        public EFTable(DataContext ctx) => context = ctx;

        public IQueryable<Table41> Table41 => context.Table41;

        public IQueryable<Table43> Table43 => context.Table43;

        public IQueryable<Table44> Table44 => context.Table44;

        public IQueryable<Table511> Table511 => context.Table511;

        public IQueryable<Table512> Table512 => context.Table512;

        public IQueryable<Table51> Table51 => context.Table51;

        public IQueryable<Table53> Table53 => context.Table53;

        public IQueryable<Table54> Table54 => context.Table54;

        public IQueryable<Table55> Table55 => context.Table55;

        public IQueryable<Table551> Table551 => context.Table551;

        public IQueryable<Table57> Table57 => context.Table57;

        public IQueryable<AttachmentB> AttachmentB => context.AttachmentB;

        public IQueryable<AttachmentG> AttachmentG => context.AttachmentG;

        public IQueryable<AttachmentJ> AttachmentJ => context.AttachmentJ;

        public IQueryable<AttachmentA> AttachmentA => context.AttachmentA;
    }
}
