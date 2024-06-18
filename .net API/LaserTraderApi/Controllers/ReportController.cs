using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace LaserTraderApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        [Route("contacts")]
        public async Task<IActionResult> GetContactsReport(ContactReportRequest request)
        {
            var results = await _reportService.GetCsvContacts(request);
            var builder = new StringBuilder();
            string header = "Date Created";
            if (request.FullName == 1)
            {
                header += ",Last Name,First Name";
            }
            if (request.CompanyName == 1)
            {
                header += ",Company Name";
            }
            if (request.Address == 1)
            {
                header += ",Address";
            }
            if (request.Email == 1)
            {
                header += ",Email";
            }
            if (request.Phone == 1)
            {
                header += ",Phone";
            }
            if (request.Sku == 1)
            {
                header += ",SKU";
            }
            if (request.Comments == 1)
            {
                header += ",Comments";
            }
            header += ",Is Active,Contact Type";
            builder.AppendLine(header);
            foreach (var item in results)
            {
                string content = $"\"{item.DateCreated}\"";
                if (request.FullName == 1)
                {
                    content += $",\"{item.LastName}\",\"{item.FirstName}\"";
                }
                if (request.CompanyName == 1)
                {
                    content += $",\"{item.CompanyName}\"";
                }
                if (request.Address == 1)
                {
                    content += $",\"{item.Address}\"";
                }
                if (request.Email == 1)
                {
                    content += $",\"{item.Email}\"";
                }
                if (request.Phone == 1)
                {
                    content += $",\"{item.Phone}\"";
                }
                if (request.Sku == 1)
                {
                    content += $",\"{item.SKU}\"";
                }
                if (request.Comments == 1)
                {
                    content += $",\"{item.Comments}\"";
                }
                content += $",{item.IsActive},{item.ContactType}";
                builder.AppendLine(content);
            }
            return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", $"contacts_report_{request.StartDate.ToString("MMddyyyy")}_{request.EndDate.ToString("MMddyyyy")}.csv");
        }

        [HttpPost]
        [Route("products")]
        public async Task<IActionResult> GetProductReports(ProductReportRequest request)
        {
            var results = await _reportService.GetCsvProducts(request);
            var builder = new StringBuilder();
            string header = "Product ID";
            if (request.CompanyName == 1)
            {
                header += ",Company";
            }
            if (request.ProductModel == 1)
            {
                header += ",Product Model";
            }
            if (request.Type == 1)
            {
                header += ",Type";
            }
            if (request.WaveLength == 1)
            {
                header += ",WaveLength";
            }
            if (request.Description == 1)
            {
                header += ",Description";
            }

            header += ",Options,Is Active,Created Date,Modified Date";
            builder.AppendLine(header);
            foreach (var item in results)
            {
                string content = $"\"{item.ProductId}\"";
                if (request.CompanyName == 1)
                {
                    content += $",\"{item.Company}\"";
                }
                if (request.ProductModel == 1)
                {
                    content += $",\"{item.ProductModel}\"";
                }
                if (request.Type == 1)
                {
                    content += $",\"{item.Type}\"";
                }
                if (request.WaveLength == 1)
                {
                    content += $",\"{item.WaveLength}\"";
                }
                if (request.Description == 1)
                {
                    content += $",\"{item.Description}\"";
                }
                content += $",\"{item.ProductOption}\",{item.IsActive},{item.CreatedDate},{item.ModifiedDate}";
                builder.AppendLine(content);
            }
            return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", $"products_report_{request.StartDate.ToString("MMddyyyy")}_{request.EndDate.ToString("MMddyyyy")}.csv");
        }

        [HttpPost]
        [Route("inventories")]
        public async Task<IActionResult> GetInventoryReport(InventoryReportRequest request)
        {
            var results = await _reportService.GetCsvInventories(request);
            var builder = new StringBuilder();
            string header = "Inventory ID";
            if (request.ProductCompany == 1)
            {
                header += ",Company";
            }
            if (request.ProductModel == 1)
            {
                header += ",Product Model";
            }
            if (request.ProductYear == 1)
            {
                header += ",Year";
            }
            if (request.Sku == 1)
            {
                header += ",SKU";
            }
            if (request.Include30DayWarranty == 1)
            {
                header += ",Seller Warranty";
            }
            header += ",Asking Price,O.B.O,Description";
            if (request.ContactFullName == 1)
            {
                header += ",Last Name,FirstName";
            }
            if (request.ContactCompanyName == 1)
            {
                header += ",Company Name";
            }
            if (request.ContactAddress == 1)
            {
                header += ",Address";
            }
            if (request.ContactEmail == 1)
            {
                header += ",Email";
            }
            if (request.ContactPhone == 1)
            {
                header += ",Phone";
            }
            if (request.ContactComments == 1)
            {
                header += ",Comments";
            }
            header += ",Created Date,Modified Date";
            builder.AppendLine(header);
            foreach (var item in results)
            {
                string content = $"\"{item.InventoryId}\"";
                if (request.ProductCompany == 1)
                {
                    content += $",\"{item.ProductCompany}\"";
                }
                if (request.ProductModel == 1)
                {
                    content += $",\"{item.ProductModel}\"";
                }
                if (request.ProductYear == 1)
                {
                    content += $",{item.ProductYear}";
                }
                if (request.Sku == 1)
                {
                    content += $",\"{item.SKU}\"";
                }
                if (request.Include30DayWarranty == 1)
                {
                    content += $",{item.SellerWarranty}";
                }
                content += $",\"{item.AskingPrice}\",{item.BestOffer},\"{item.Description}\"";
                if (request.ContactFullName == 1)
                {
                    content += $",\"{item.LastName}\",\"{item.FirstName}\"";
                }
                if (request.ContactCompanyName == 1)
                {
                    content += $",\"{item.CompanyName}\"";
                }
                if (request.ContactAddress == 1)
                {
                    content += $",\"{item.Address}\"";
                }
                if (request.ContactEmail == 1)
                {
                    content += $",\"{item.Email}\"";
                }
                if (request.ContactPhone == 1)
                {
                    content += $",\"{item.Phone}\"";
                }
                if (request.ContactComments == 1)
                {
                    content += $",\"{item.Comments}\"";
                }
                content += $",\"{item.CreatedDate}\",\"{item.ModifiedDate}\"";
                builder.AppendLine(content);
            }
            return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", $"inventory_report_{request.StartDate.ToString("MMddyyyy")}_{request.EndDate.ToString("MMddyyyy")}.csv");
        }
    }
}
