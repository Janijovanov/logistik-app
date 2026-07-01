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

        // Use Include without OrderBy, then filter entries via ThenInclude.
        // Combining OrderBy inside Include with a filtered ThenInclude breaks
        // EF Core's type resolution (IOrderedEnumerable vs IEnumerable mismatch).
        var categories = await _db.ExpenseCategories
            .Include(c => c.Subcategories)
                .ThenInclude(s => s.Entries.Where(e => e.Year == year))
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
                    amounts = s.Entries.ToDictionary(e => e.Month, e => e.Amount)
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
}

public record CategoryRequest(string Name);
public record SubcategoryRequest(int CategoryId, string Name, decimal AnnualPlan);
public record EntryRequest(int SubcategoryId, int Year, int Month, decimal Amount);
