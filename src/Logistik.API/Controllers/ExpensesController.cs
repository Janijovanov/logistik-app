using ClosedXML.Excel;
using Logistik.Domain.Entities;
using Logistik.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/expenses")]
[Authorize(Roles = "Admin")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ExpensesController(AppDbContext db) => _db = db;

    // ── GET /api/expenses?year=2026 ──────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetForYear([FromQuery] int year, CancellationToken ct)
    {
        if (year < 2000 || year > 2100) year = DateTime.UtcNow.Year;

        // Load all entries for all years (no filtered include) then filter in memory.
        // Filtered includes + ThenInclude have compatibility issues across EF Core versions.
        var categories = await _db.ExpenseCategories
            .Include(c => c.Subcategories)
                .ThenInclude(s => s.Entries)
            .OrderBy(c => c.Order)
            .ToListAsync(ct);

        var result = categories.Select(c => new
        {
            c.Id,
            c.Name,
            c.Order,
            subcategories = c.Subcategories
                .OrderBy(s => s.Order)
                .Select(s => new
                {
                    s.Id,
                    s.CategoryId,
                    s.Name,
                    s.Order,
                    s.AnnualPlan,
                    amounts = s.Entries
                        .Where(e => e.Year == year)
                        .GroupBy(e => e.Month)
                        .ToDictionary(g => g.Key, g => g.First().Amount)
                })
        });

        return Ok(new { year, categories = result });
    }

    // ── Categories CRUD ──────────────────────────────────────────────────────
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name)) return BadRequest(new { message = "Името е задолжително." });
        var maxOrder = await _db.ExpenseCategories.MaxAsync(c => (int?)c.Order, ct) ?? 0;
        var cat = new ExpenseCategory { Name = req.Name.Trim(), Order = maxOrder + 1 };
        _db.ExpenseCategories.Add(cat);
        await _db.SaveChangesAsync(ct);
        return Ok(new { cat.Id, cat.Name, cat.Order });
    }

    [HttpPut("categories/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryRequest req, CancellationToken ct)
    {
        var cat = await _db.ExpenseCategories.FindAsync([id], ct);
        if (cat is null) return NotFound();
        if (string.IsNullOrWhiteSpace(req.Name)) return BadRequest(new { message = "Името е задолжително." });
        cat.Name = req.Name.Trim();
        cat.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id, CancellationToken ct)
    {
        var cat = await _db.ExpenseCategories
            .Include(c => c.Subcategories).ThenInclude(s => s.Entries)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
        if (cat is null) return NotFound();
        _db.ExpenseCategories.Remove(cat);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Subcategories CRUD ───────────────────────────────────────────────────
    [HttpPost("subcategories")]
    public async Task<IActionResult> CreateSubcategory([FromBody] SubcategoryRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name)) return BadRequest(new { message = "Името е задолжително." });
        var cat = await _db.ExpenseCategories.FindAsync([req.CategoryId], ct);
        if (cat is null) return BadRequest(new { message = "Категоријата не постои." });
        var maxOrder = await _db.ExpenseSubcategories.Where(s => s.CategoryId == req.CategoryId).MaxAsync(s => (int?)s.Order, ct) ?? 0;
        var sub = new ExpenseSubcategory
        {
            CategoryId = req.CategoryId,
            Name = req.Name.Trim(),
            Order = maxOrder + 1,
            AnnualPlan = req.AnnualPlan
        };
        _db.ExpenseSubcategories.Add(sub);
        await _db.SaveChangesAsync(ct);
        return Ok(new { sub.Id, sub.CategoryId, sub.Name, sub.Order, sub.AnnualPlan });
    }

    [HttpPut("subcategories/{id:int}")]
    public async Task<IActionResult> UpdateSubcategory(int id, [FromBody] SubcategoryRequest req, CancellationToken ct)
    {
        var sub = await _db.ExpenseSubcategories.FindAsync([id], ct);
        if (sub is null) return NotFound();
        if (string.IsNullOrWhiteSpace(req.Name)) return BadRequest(new { message = "Името е задолжително." });
        sub.Name = req.Name.Trim();
        sub.AnnualPlan = req.AnnualPlan;
        sub.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("subcategories/{id:int}")]
    public async Task<IActionResult> DeleteSubcategory(int id, CancellationToken ct)
    {
        var sub = await _db.ExpenseSubcategories
            .Include(s => s.Entries)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
        if (sub is null) return NotFound();
        _db.ExpenseSubcategories.Remove(sub);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Expense entries (upsert) ─────────────────────────────────────────────
    [HttpPut("entries")]
    public async Task<IActionResult> UpsertEntry([FromBody] EntryRequest req, CancellationToken ct)
    {
        if (req.Month < 1 || req.Month > 12) return BadRequest(new { message = "Невалиден месец." });
        if (req.Year < 2000 || req.Year > 2100) return BadRequest(new { message = "Невалидна година." });

        var existing = await _db.ExpenseEntries.FirstOrDefaultAsync(
            e => e.SubcategoryId == req.SubcategoryId && e.Year == req.Year && e.Month == req.Month, ct);

        if (req.Amount <= 0)
        {
            if (existing is not null) { _db.ExpenseEntries.Remove(existing); await _db.SaveChangesAsync(ct); }
            return NoContent();
        }

        if (existing is null)
        {
            _db.ExpenseEntries.Add(new ExpenseEntry
            {
                SubcategoryId = req.SubcategoryId,
                Year = req.Year,
                Month = req.Month,
                Amount = req.Amount
            });
        }
        else
        {
            existing.Amount = req.Amount;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── GET /api/expenses/export?year=2026 — Excel export ────────────────────
    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] int year, CancellationToken ct)
    {
        if (year < 2000 || year > 2100) year = DateTime.UtcNow.Year;

        var categories = await _db.ExpenseCategories
            .Include(c => c.Subcategories).ThenInclude(s => s.Entries)
            .OrderBy(c => c.Order)
            .ToListAsync(ct);

        string[] months = { "Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек" };

        // Replicate GetForYear EXACTLY: group this year's entries by month and take
        // the FIRST amount per month (not a sum). This keeps the export identical to
        // the on-screen table even when duplicate entries exist for the same month.
        var amountsBySub = categories
            .SelectMany(c => c.Subcategories)
            .ToDictionary(
                s => s.Id,
                s => s.Entries.Where(e => e.Year == year)
                      .GroupBy(e => e.Month)
                      .ToDictionary(g => g.Key, g => g.First().Amount));

        decimal MonthAmount(ExpenseSubcategory s, int m) =>
            amountsBySub[s.Id].TryGetValue(m, out var v) ? v : 0m;

        decimal grandTotal = categories.Sum(c =>
            c.Subcategories.Sum(s => amountsBySub[s.Id].Values.Sum()));

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add($"Трошоци {year}");

        // Header — Бр. | Назив | Jan..Dec | Вкупно | % | бр.мес. | Месечно | Годишно
        int col = 1;
        ws.Cell(1, col++).Value = "Бр.";
        ws.Cell(1, col++).Value = "Назив";
        for (int m = 0; m < 12; m++) ws.Cell(1, col++).Value = months[m];
        int sumCol = col; ws.Cell(1, col++).Value = "Вкупно";
        int pctCol = col; ws.Cell(1, col++).Value = "%";
        int cntCol = col; ws.Cell(1, col++).Value = "бр.мес.";
        int monCol = col; ws.Cell(1, col++).Value = "Месечно";
        int annCol = col; ws.Cell(1, col++).Value = "Годишно";

        ws.Row(1).Style.Font.Bold = true;
        ws.Row(1).Style.Fill.BackgroundColor = XLColor.FromHtml("#DBEAFE");
        ws.Row(1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        int row = 2;
        int catIdx = 0;
        foreach (var cat in categories)
        {
            catIdx++;
            decimal catVkupno = 0;
            for (int m = 1; m <= 12; m++)
            {
                decimal mt = cat.Subcategories.Sum(s => MonthAmount(s, m));
                catVkupno += mt;
                if (mt != 0) ws.Cell(row, 2 + m).Value = (double)mt;
            }
            decimal catAnnual = cat.Subcategories.Sum(s => s.AnnualPlan);
            ws.Cell(row, 1).Value = catIdx;
            ws.Cell(row, 2).Value = cat.Name;
            ws.Cell(row, sumCol).Value = (double)catVkupno;
            ws.Cell(row, pctCol).Value = grandTotal > 0 ? (double)(catVkupno / grandTotal * 100) : 0;
            ws.Cell(row, monCol).Value = (double)(catAnnual / 12);
            ws.Cell(row, annCol).Value = (double)catAnnual;
            ws.Row(row).Style.Font.Bold = true;
            ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#EEF2FF");
            row++;

            int subIdx = 0;
            foreach (var sub in cat.Subcategories.OrderBy(s => s.Order))
            {
                subIdx++;
                decimal subVkupno = 0;
                int cnt = 0;
                for (int m = 1; m <= 12; m++)
                {
                    decimal amt = MonthAmount(sub, m);
                    if (amt != 0) { ws.Cell(row, 2 + m).Value = (double)amt; subVkupno += amt; cnt++; }
                }
                ws.Cell(row, 1).Value = $"{catIdx}.{subIdx}";
                ws.Cell(row, 2).Value = sub.Name;
                ws.Cell(row, sumCol).Value = (double)subVkupno;
                ws.Cell(row, pctCol).Value = grandTotal > 0 ? (double)(subVkupno / grandTotal * 100) : 0;
                ws.Cell(row, cntCol).Value = cnt;
                ws.Cell(row, monCol).Value = (double)(sub.AnnualPlan / 12);
                ws.Cell(row, annCol).Value = (double)sub.AnnualPlan;
                row++;
            }
        }

        // Grand total row
        ws.Cell(row, 2).Value = "ВКУПНО";
        for (int m = 1; m <= 12; m++)
        {
            decimal mt = categories.Sum(c => c.Subcategories.Sum(s => MonthAmount(s, m)));
            if (mt != 0) ws.Cell(row, 2 + m).Value = (double)mt;
        }
        decimal gAnnual = categories.Sum(c => c.Subcategories.Sum(s => s.AnnualPlan));
        int gCnt = categories.Sum(c => c.Subcategories.Sum(s => amountsBySub[s.Id].Values.Count(v => v > 0)));
        ws.Cell(row, sumCol).Value = (double)grandTotal;
        ws.Cell(row, pctCol).Value = grandTotal > 0 ? 100d : 0d;
        ws.Cell(row, cntCol).Value = gCnt;
        ws.Cell(row, monCol).Value = (double)(gAnnual / 12);
        ws.Cell(row, annCol).Value = (double)gAnnual;
        ws.Row(row).Style.Font.Bold = true;
        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#FEF9C3");

        // Number formats
        ws.Range(2, 3, row, annCol).Style.NumberFormat.Format = "#,##0";
        ws.Column(pctCol).Style.NumberFormat.Format = "0.00";
        ws.Column(2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
        ws.Columns().AdjustToContents();
        ws.SheetView.FreezeRows(1);

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return File(ms.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"Trosoci-{year}.xlsx");
    }
}

public record CategoryRequest(string Name);
public record SubcategoryRequest(int CategoryId, string Name, decimal AnnualPlan);
public record EntryRequest(int SubcategoryId, int Year, int Month, decimal Amount);
