using ClosedXML.Excel;
using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Logistik.Infrastructure.Services;

public class ExportService : IExportService
{
    private readonly IUnitOfWork _uow;

    public ExportService(IUnitOfWork uow)
    {
        _uow = uow;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> ExportEmployeeToPdfAsync(int employeeId, CancellationToken ct = default)
    {
        var employee = await _uow.Employees.GetWithOrdersAsync(employeeId, ct);
        if (employee is null) return Array.Empty<byte>();

        var salaries = await _uow.SalaryHistories.GetByEmployeeAsync(employeeId, 1, 1000, ct);

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.Header().Text($"Employee Report: {employee.FullName}").Bold().FontSize(18);
                page.Content().Column(col =>
                {
                    col.Item().Text($"EMBG: {employee.EMBG}");
                    col.Item().Text($"Employment Start: {employee.EmploymentStartDate}");
                    col.Item().Text($"Employment End: {employee.EmploymentEndDate?.ToString() ?? "N/A"}");
                    col.Item().Text($"Bank Account: {employee.BankAccount}");
                    col.Item().Text($"Net Salary: {employee.NetSalary:N2} MKD");

                    col.Item().PaddingTop(10).Text("Salary History").Bold().FontSize(14);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                        });
                        table.Header(header =>
                        {
                            header.Cell().Text("Month").Bold();
                            header.Cell().Text("Net Salary").Bold();
                            header.Cell().Text("Deduction").Bold();
                        });
                        foreach (var s in salaries)
                        {
                            table.Cell().Text(s.SalaryMonth.ToString("yyyy-MM"));
                            table.Cell().Text(s.NetSalary.ToString("N2"));
                            table.Cell().Text(s.DeductionAmount.ToString("N2"));
                        }
                    });
                });
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" of ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> ExportEmployeeToExcelAsync(int employeeId, CancellationToken ct = default)
    {
        var employee = await _uow.Employees.GetByIdAsync(employeeId, ct);
        if (employee is null) return Array.Empty<byte>();

        var salaries = await _uow.SalaryHistories.GetByEmployeeAsync(employeeId, 1, 1000, ct);

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Salary History");

        ws.Cell(1, 1).Value = "Month";
        ws.Cell(1, 2).Value = "Net Salary (MKD)";
        ws.Cell(1, 3).Value = "Deduction (MKD)";
        ws.Cell(1, 4).Value = "Order Number";

        var headerRow = ws.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;
        foreach (var s in salaries)
        {
            ws.Cell(row, 1).Value = s.SalaryMonth.ToString("yyyy-MM");
            ws.Cell(row, 2).Value = (double)s.NetSalary;
            ws.Cell(row, 3).Value = (double)s.DeductionAmount;
            ws.Cell(row, 4).Value = s.EnforcementOrder?.OrderNumber ?? "";
            row++;
        }

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public async Task<byte[]> ExportEnforcementOrderToPdfAsync(int orderId, CancellationToken ct = default)
    {
        var order = await _uow.EnforcementOrders.GetWithPaymentsAsync(orderId, ct);
        if (order is null) return Array.Empty<byte>();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.Header().Text($"Enforcement Order: {order.OrderNumber}").Bold().FontSize(18);
                page.Content().Column(col =>
                {
                    col.Item().Text($"Executor: {order.ExecutorName}");
                    col.Item().Text($"Total Amount: {order.TotalAmount:N2} MKD");
                    col.Item().Text($"Total Paid: {order.TotalPaid:N2} MKD");
                    col.Item().Text($"Remaining: {order.RemainingAmount:N2} MKD");
                    col.Item().Text($"Status: {order.Status}");

                    col.Item().PaddingTop(10).Text("Payment History").Bold().FontSize(14);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                        });
                        table.Header(header =>
                        {
                            header.Cell().Text("Month").Bold();
                            header.Cell().Text("Amount Paid").Bold();
                            header.Cell().Text("Remaining").Bold();
                        });
                        foreach (var p in order.Payments.OrderBy(p => p.PaymentMonth))
                        {
                            table.Cell().Text(p.PaymentMonth.ToString("yyyy-MM"));
                            table.Cell().Text(p.AmountPaid.ToString("N2"));
                            table.Cell().Text(p.RemainingAfterPayment.ToString("N2"));
                        }
                    });
                });
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> ExportEnforcementOrderToExcelAsync(int orderId, CancellationToken ct = default)
    {
        var order = await _uow.EnforcementOrders.GetWithPaymentsAsync(orderId, ct);
        if (order is null) return Array.Empty<byte>();

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Payment History");

        ws.Cell(1, 1).Value = "Month";
        ws.Cell(1, 2).Value = "Amount Paid (MKD)";
        ws.Cell(1, 3).Value = "Remaining (MKD)";

        ws.Row(1).Style.Font.Bold = true;
        ws.Row(1).Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;
        foreach (var p in order.Payments.OrderBy(p => p.PaymentMonth))
        {
            ws.Cell(row, 1).Value = p.PaymentMonth.ToString("yyyy-MM");
            ws.Cell(row, 2).Value = (double)p.AmountPaid;
            ws.Cell(row, 3).Value = (double)p.RemainingAfterPayment;
            row++;
        }

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public async Task<byte[]> ExportCompanyEmployeesToExcelAsync(int companyId, CancellationToken ct = default)
    {
        var (employees, _) = await _uow.Employees.GetPagedAsync(companyId, 1, 10000, null, false, ct);

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Employees");

        ws.Cell(1, 1).Value = "Full Name";
        ws.Cell(1, 2).Value = "EMBG";
        ws.Cell(1, 3).Value = "Start Date";
        ws.Cell(1, 4).Value = "End Date";
        ws.Cell(1, 5).Value = "Bank Account";
        ws.Cell(1, 6).Value = "Net Salary (MKD)";

        ws.Row(1).Style.Font.Bold = true;
        ws.Row(1).Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;
        foreach (var e in employees)
        {
            ws.Cell(row, 1).Value = e.FullName;
            ws.Cell(row, 2).Value = e.EMBG;
            ws.Cell(row, 3).Value = e.EmploymentStartDate.ToString();
            ws.Cell(row, 4).Value = e.EmploymentEndDate?.ToString() ?? "";
            ws.Cell(row, 5).Value = e.BankAccount;
            ws.Cell(row, 6).Value = (double)e.NetSalary;
            row++;
        }

        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public async Task<byte[]> ExportPaymentOrderPdfAsync(int salaryRecordId, bool overflow = false, CancellationToken ct = default)
    {
        var record = await _uow.SalaryHistories.GetForPaymentOrderAsync(salaryRecordId, ct);
        if (record is null) return Array.Empty<byte>();

        var order = overflow ? record.OverflowEnforcementOrder : record.EnforcementOrder;
        if (order is null) return Array.Empty<byte>();

        var companyName = record.Employee.Company.Name;
        var orderNumber = order.OrderNumber;
        var executorName = order.ExecutorName;
        var executorBankAccount = order.ExecutorBankAccount;
        var amount = overflow ? (record.OverflowDeductionAmount ?? 0) : record.DeductionAmount;
        var month = record.SalaryMonth.ToString("MM/yyyy");

        var labelColor = "#003087";
        var headerColor = "#E65100";

        var doc = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(210, 148, Unit.Millimetre); // A5 landscape
                page.Margin(8, Unit.Millimetre);
                page.DefaultTextStyle(x => x.FontSize(8).FontFamily("Arial"));

                page.Content().Border(1).Row(outerRow =>
                {
                    // ── LEFT COLUMN (Испраќач) ──────────────────────────
                    outerRow.RelativeItem().BorderRight(1).Padding(8).Column(left =>
                    {
                        left.Item().AlignRight().Text("Испраќач")
                            .FontSize(8).FontColor(headerColor).Bold();

                        left.Item().PaddingTop(6).Element(e => LabeledBox(e, "Налогодавач", companyName, labelColor));
                        left.Item().PaddingTop(5).Element(e => LabeledBox(e, "Сметка на налогодавачот", "", labelColor));
                        left.Item().PaddingTop(5).Element(e => LabeledBox(e, "Назив на банка на налогодавач", "", labelColor));
                        left.Item().PaddingTop(5).Element(e => LabeledBox(e, "Повикување на број-(Задолжување)", "", labelColor));
                        left.Item().PaddingTop(5).Element(e => LabeledBox(e, "Цел на плаќање", orderNumber, labelColor));
                    });

                    // ── RIGHT COLUMN (Примател) ─────────────────────────
                    outerRow.RelativeItem().Padding(8).Column(right =>
                    {
                        right.Item().Row(topRow =>
                        {
                            topRow.RelativeItem().Element(e => LabeledBox(e, "Датум на валута", "", labelColor, 36));
                            topRow.ConstantItem(60).AlignRight().Text("Примател")
                                .FontSize(8).FontColor(headerColor).Bold();
                        });

                        right.Item().PaddingTop(6).Element(e => LabeledBox(e, "Корисник", executorName, labelColor));
                        right.Item().PaddingTop(5).Element(e => LabeledBox(e, "Сметка на корисникот", executorBankAccount, labelColor));
                        right.Item().PaddingTop(5).Element(e => LabeledBox(e, "Назив на банка на корисник", "", labelColor));

                        // Валута + Износ row
                        right.Item().PaddingTop(5).Row(r =>
                        {
                            r.ConstantItem(55).Column(c =>
                            {
                                c.Item().Text("Валута").FontSize(7).FontColor(labelColor);
                                c.Item().Border(1).Padding(3).Text("MKD").FontSize(8);
                            });
                            r.RelativeItem().PaddingLeft(5).Column(c =>
                            {
                                c.Item().AlignRight().Text("Износ").FontSize(7).FontColor(labelColor);
                                c.Item().Border(1).Padding(3).AlignRight()
                                    .Text($"{amount:N2}").FontSize(8).Bold();
                            });
                        });

                        right.Item().PaddingTop(5).Element(e => LabeledBox(e, "Повикување на број-(Одобрување)", "", labelColor));

                        // Шифра + Начин row
                        right.Item().PaddingTop(5).Row(r =>
                        {
                            r.ConstantItem(80).Element(e => LabeledBox(e, "Шифра на плаќање", "", labelColor, 18));
                            r.RelativeItem().PaddingLeft(5).Element(e => LabeledBox(e, "Начин", "", labelColor, 18));
                        });

                        right.Item().PaddingTop(4).Element(e => LabeledBox(e, "Референца", "", labelColor, 18));
                    });
                });
            });
        });

        return doc.GeneratePdf();
    }

    public async Task<byte[]> ExportEnforcementDeductionsToExcelAsync(int companyId, int year, int month, CancellationToken ct = default)
    {
        var monthDate = new DateOnly(year, month, 1);
        var (employees, _) = await _uow.Employees.GetPagedAsync(companyId, 1, 10000, null, false, ct);
        var salaries = await _uow.SalaryHistories.GetByCompanyAndMonthAsync(companyId, monthDate, ct);
        var activeOrders = await _uow.EnforcementOrders.GetActiveOrdersForCompanyAsync(companyId, ct);

        var salaryLookup = salaries.ToDictionary(s => s.EmployeeId);
        var activeOrderLookup = activeOrders.ToDictionary(o => o.EmployeeId);

        var rows = employees
            .OrderBy(e => e.FullName)
            .Select(e =>
            {
                salaryLookup.TryGetValue(e.Id, out var sal);
                return new { Employee = e, Salary = sal, Order = sal?.EnforcementOrder };
            })
            .Where(x => x.Salary is not null && x.Salary.DeductionAmount > 0)
            .ToList();

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add($"{new System.Globalization.CultureInfo("mk-MK").DateTimeFormat.GetMonthName(month)} {year}");

        var headers = new[] { "Вработен", "Извршител", "Трансакциска сметка", "И.бр.", "Износ 1/5 (МКД)" };
        for (int i = 0; i < headers.Length; i++)
        {
            ws.Cell(1, i + 1).Value = headers[i];
        }
        var headerRow = ws.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#1565C0");
        headerRow.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var x in rows)
        {
            var deduction = x.Salary!.DeductionAmount;
            ws.Cell(row, 1).Value = x.Employee.FullName;
            ws.Cell(row, 2).Value = x.Order!.ExecutorName;
            ws.Cell(row, 3).Value = x.Order.ExecutorBankAccount;
            ws.Cell(row, 4).Value = x.Order.OrderNumber;
            ws.Cell(row, 5).Value = (double)deduction;
            ws.Cell(row, 5).Style.NumberFormat.Format = "#,##0.00";

            if (x.Salary is not null && x.Salary.DeductionAmount > 0)
                ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#E8F5E9");

            row++;
        }

        // Total row
        ws.Cell(row, 4).Value = "Вкупно:";
        ws.Cell(row, 4).Style.Font.Bold = true;
        ws.Cell(row, 5).FormulaA1 = $"SUM(E2:E{row - 1})";
        ws.Cell(row, 5).Style.Font.Bold = true;
        ws.Cell(row, 5).Style.NumberFormat.Format = "#,##0.00";

        ws.Columns().AdjustToContents();
        ws.Column(1).Width = Math.Max(ws.Column(1).Width, 24);
        ws.Column(3).Width = Math.Max(ws.Column(3).Width, 20);

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    private static void LabeledBox(IContainer container, string label, string value, string labelColor, int boxHeight = 22)
    {
        container.Column(col =>
        {
            col.Item().Text(label).FontSize(7).FontColor(labelColor);
            col.Item().Height(boxHeight).Border(1).Padding(3).AlignMiddle().Text(value).FontSize(8);
        });
    }
}
