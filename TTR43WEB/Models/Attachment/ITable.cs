using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TTR43WEB.Data;

namespace TTR43WEB.Models.Attachment
{
    public interface ITable
    {
        IQueryable<Table41> Table41 { get; }
        IQueryable<Table43> Table43 { get; }
        IQueryable<Table44> Table44 { get; }
        IQueryable<Table511> Table511 { get; }
        IQueryable<Table512> Table512 { get; }
        IQueryable<Table51> Table51 { get; }
        IQueryable<Table53> Table53 { get; }
        IQueryable<Table54> Table54 { get; }
        IQueryable<Table55> Table55 { get; }
        IQueryable<Table551> Table551 { get; }
        IQueryable<Table57> Table57 { get; }
        IQueryable<AttachmentB> AttachmentB { get; }
        IQueryable<AttachmentG> AttachmentG { get; }
        IQueryable<AttachmentJ> AttachmentJ { get; }
        IQueryable<AttachmentA> AttachmentA { get; }
    }
}
