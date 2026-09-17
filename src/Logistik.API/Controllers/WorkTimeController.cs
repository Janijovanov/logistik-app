using ClosedXML.Excel;
using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Entities;
using Logistik.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Logistik.API.Controllers;

[ApiController]
[Route("api/worktime")]
[Authorize]
public class WorkTimeController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public WorkTimeController(AppDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    // ── Companies ────────────────────────────────────────────────────────────

    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies(CancellationToken ct)
    {
        var companies = await _db.WorkTimeCompanies
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new { c.Id, c.Name })
            .ToListAsync(ct);
        return Ok(companies);
    }

    [HttpPost("companies")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCompany([FromBody] WorkTimeCompanyRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Името е задолжително." });

        var company = new WorkTimeCompany { Name = req.Name.Trim() };
        _db.WorkTimeCompanies.Add(company);
        await _db.SaveChangesAsync(ct);
        return Ok(new { company.Id, company.Name });
    }

    [HttpPut("companies/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCompany(int id, [FromBody] WorkTimeCompanyRequest req, CancellationToken ct)
    {
        var company = await _db.WorkTimeCompanies.FindAsync([id], ct);
        if (company is null) return NotFound();
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Името е задолжително." });

        company.Name = req.Name.Trim();
        company.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("companies/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCompany(int id, CancellationToken ct)
    {
        var company = await _db.WorkTimeCompanies
            .Include(c => c.Entries)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
        if (company is null) return NotFound();

        company.IsActive = false;
        company.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Document Types ───────────────────────────────────────────────────────

    [HttpGet("document-types")]
    public async Task<IActionResult> GetDocumentTypes(CancellationToken ct)
    {
        var types = await _db.WorkDocumentTypes
            .Where(t => t.IsActive)
            .OrderBy(t => t.Order)
            .Select(t => new { t.Id, t.Name, t.Order })
            .ToListAsync(ct);
        return Ok(types);
    }

    [HttpPost("document-types")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDocumentType([FromBody] WorkDocumentTypeRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Името е задолжително." });

        var maxOrder = await _db.WorkDocumentTypes.MaxAsync(t => (int?)t.Order, ct) ?? 0;
        var docType = new WorkDocumentType { Name = req.Name.Trim(), Order = maxOrder + 1 };
        _db.WorkDocumentTypes.Add(docType);
        await _db.SaveChangesAsync(ct);
        return Ok(new { docType.Id, docType.Name, docType.Order });
    }

    [HttpPut("document-types/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateDocumentType(int id, [FromBody] WorkDocumentTypeRequest req, CancellationToken ct)
    {
        var docType = await _db.WorkDocumentTypes.FindAsync([id], ct);
        if (docType is null) return NotFound();
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Името е задолжително." });

        docType.Name = req.Name.Trim();
        docType.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("document-types/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDocumentType(int id, CancellationToken ct)
    {
        var docType = await _db.WorkDocumentTypes.FindAsync([id], ct);
        if (docType is null) return NotFound();

        docType.IsActive = false;
        docType.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Entries ──────────────────────────────────────────────────────────────

    [HttpGet("entries")]
    public async Task<IActionResult> GetEntries(
        [FromQuery] string date,
        [FromQuery] int companyId,
        [FromQuery] int? userId,
        [FromQuery] int kind,
        CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
            return BadRequest(new { message = "Невалиден датум." });

        var query = _db.WorkTimeEntries
            .Include(e => e.DocumentType)
            .Include(e => e.User)
            .Where(e => e.Date == parsedDate && e.WorkTimeCompanyId == companyId && e.Kind == kind);

        if (_currentUser.IsAdmin)
        {
            if (userId.HasValue)
                query = query.Where(e => e.UserId == userId.Value);
        }
        else
        {
            query = query.Where(e => e.UserId == _currentUser.UserId);
        }

        var entries = await query
            .OrderBy(e => e.DocumentType.Order)
            .Select(e => new
            {
                e.Id,
                e.UserId,
                userName = e.User.FirstName + " " + e.User.LastName,
                e.WorkTimeCompanyId,
                e.WorkDocumentTypeId,
                documentTypeName = e.DocumentType.Name,
                documentTypeOrder = e.DocumentType.Order,
                date = e.Date.ToString("yyyy-MM-dd"),
                e.DocumentCount,
                e.Minutes,
                e.Notes
            })
            .ToListAsync(ct);

        return Ok(entries);
    }

    [HttpGet("yearly-summary")]
    public async Task<IActionResult> GetYearlySummary(
        [FromQuery] int companyId,
        [FromQuery] int year,
        [FromQuery] int? userId,
        [FromQuery] int kind,
        CancellationToken ct)
    {
        var start = new DateOnly(year, 1, 1);
        var end = start.AddYears(1);

        var query = _db.WorkTimeEntries
            .Where(e => e.WorkTimeCompanyId == companyId && e.Date >= start && e.Date < end && e.Kind == kind);

        if (_currentUser.IsAdmin)
        {
            if (userId.HasValue)
                query = query.Where(e => e.UserId == userId.Value);
        }
        else
        {
            query = query.Where(e => e.UserId == _currentUser.UserId);
        }

        // Pull minimal data and group in memory (small volume: one company / one year)
        var rows = await query
            .Select(e => new { e.Date, e.DocumentCount, e.Minutes })
            .ToListAsync(ct);

        var byMonth = rows
            .GroupBy(e => e.Date.Month)
            .Select(g => new
            {
                month = g.Key,
                documentCount = g.Sum(e => e.DocumentCount),
                minutes = g.Sum(e => e.Minutes)
            })
            .OrderBy(x => x.month)
            .ToList();

        return Ok(byMonth);
    }

    [HttpGet("entry-dates")]
    public async Task<IActionResult> GetEntryDates(
        [FromQuery] int companyId,
        [FromQuery] int? userId,
        [FromQuery] int kind,
        CancellationToken ct)
    {
        var query = _db.WorkTimeEntries.Where(e => e.WorkTimeCompanyId == companyId && e.Kind == kind);

        if (_currentUser.IsAdmin)
        {
            if (userId.HasValue)
                query = query.Where(e => e.UserId == userId.Value);
        }
        else
        {
            query = query.Where(e => e.UserId == _currentUser.UserId);
        }

        var dates = await query
            .Select(e => e.Date)
            .Distinct()
            .OrderBy(d => d)
            .ToListAsync(ct);

        return Ok(dates.Select(d => d.ToString("yyyy-MM-dd")));
    }

    [HttpGet("monthly-total")]
    public async Task<IActionResult> GetMonthlyTotal(
        [FromQuery] string date,
        [FromQuery] int companyId,
        [FromQuery] int? userId,
        [FromQuery] int kind,
        CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
            return BadRequest(new { message = "Невалиден датум." });

        var monthStart = new DateOnly(parsedDate.Year, parsedDate.Month, 1);
        var monthEnd = monthStart.AddMonths(1);

        var query = _db.WorkTimeEntries
            .Where(e => e.WorkTimeCompanyId == companyId && e.Date >= monthStart && e.Date < monthEnd && e.Kind == kind);

        if (_currentUser.IsAdmin)
        {
            if (userId.HasValue)
                query = query.Where(e => e.UserId == userId.Value);
        }
        else
        {
            query = query.Where(e => e.UserId == _currentUser.UserId);
        }

        var totals = await query
            .GroupBy(_ => 1)
            .Select(g => new { documentCount = g.Sum(e => e.DocumentCount), minutes = g.Sum(e => e.Minutes) })
            .FirstOrDefaultAsync(ct);

        return Ok(totals ?? new { documentCount = 0, minutes = 0 });
    }

    [HttpPost("entries")]
    public async Task<IActionResult> UpsertEntry([FromBody] WorkTimeEntryRequest req, CancellationToken ct)
    {
        if (!DateOnly.TryParse(req.Date, out var parsedDate))
            return BadRequest(new { message = "Невалиден датум." });

        var targetUserId = _currentUser.IsAdmin && req.UserId.HasValue
            ? req.UserId.Value
            : _currentUser.UserId;

        var existing = await _db.WorkTimeEntries.FirstOrDefaultAsync(
            e => e.UserId == targetUserId
              && e.WorkTimeCompanyId == req.CompanyId
              && e.WorkDocumentTypeId == req.DocumentTypeId
              && e.Date == parsedDate
              && e.Kind == req.Kind,
            ct);

        if (req.DocumentCount == 0 && req.Minutes == 0 && string.IsNullOrWhiteSpace(req.Notes))
        {
            if (existing is not null)
            {
                _db.WorkTimeEntries.Remove(existing);
                await _db.SaveChangesAsync(ct);
            }
            return NoContent();
        }

        if (existing is null)
        {
            _db.WorkTimeEntries.Add(new WorkTimeEntry
            {
                UserId = targetUserId,
                WorkTimeCompanyId = req.CompanyId,
                WorkDocumentTypeId = req.DocumentTypeId,
                Date = parsedDate,
                DocumentCount = req.DocumentCount,
                Minutes = req.Minutes,
                Notes = req.Notes?.Trim(),
                Kind = req.Kind
            });
        }
        else
        {
            existing.DocumentCount = req.DocumentCount;
            existing.Minutes = req.Minutes;
            existing.Notes = req.Notes?.Trim();
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("entries/{id:int}")]
    public async Task<IActionResult> DeleteEntry(int id, CancellationToken ct)
    {
        var entry = await _db.WorkTimeEntries.FindAsync([id], ct);
        if (entry is null) return NotFound();

        if (!_currentUser.IsAdmin && entry.UserId != _currentUser.UserId)
            return Forbid();

        _db.WorkTimeEntries.Remove(entry);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ── Admin summary ────────────────────────────────────────────────────────

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
    {
        var users = await _db.Users
            .Where(u => u.IsActive && u.Role.Name == "User")
            .OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
            .Select(u => new { u.Id, fullName = u.FirstName + " " + u.LastName })
            .ToListAsync(ct);
        return Ok(users);
    }

    // ── Excel export ───────────────────────────────────────────────────────────
    // period: "day" | "month" | "year"; scoped to company + kind + (optional) worker.
    [HttpGet("export")]
    public async Task<IActionResult> Export(
        [FromQuery] string period,
        [FromQuery] int companyId,
        [FromQuery] string date,
        [FromQuery] int? userId,
        [FromQuery] int kind,
        CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var d))
            return BadRequest(new { message = "Невалиден датум." });

        DateOnly start, end;
        switch (period)
        {
            case "day": start = d; end = d.AddDays(1); break;
            case "month": start = new DateOnly(d.Year, d.Month, 1); end = start.AddMonths(1); break;
            case "year": start = new DateOnly(d.Year, 1, 1); end = start.AddYears(1); break;
            default: return BadRequest(new { message = "Невалиден период." });
        }

        // Non-admins can only export their own data.
        int? filterUser = _currentUser.IsAdmin ? userId : _currentUser.UserId;

        var query = _db.WorkTimeEntries
            .Include(e => e.DocumentType)
            .Include(e => e.User)
            .Where(e => e.WorkTimeCompanyId == companyId && e.Kind == kind && e.Date >= start && e.Date < end);
        if (filterUser.HasValue) query = query.Where(e => e.UserId == filterUser.Value);

        var entries = await query.ToListAsync(ct);
        var company = await _db.WorkTimeCompanies.FindAsync([companyId], ct);
        var companyName = company?.Name ?? "";
        var kindLabel = kind == 1 ? "Процена" : "Утврдено";
        string[] mk = { "Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември" };
        string periodLabel = period switch
        {
            "day" => d.ToString("dd.MM.yyyy"),
            "month" => $"{mk[d.Month - 1]} {d.Year}",
            _ => d.Year.ToString()
        };
        string workerLabel = filterUser.HasValue
            ? (entries.Count > 0 ? $"{entries[0].User.FirstName} {entries[0].User.LastName}" : "Работник")
            : "Сите работници";

        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Работно време");

        ws.Cell(1, 1).Value = "Работно време";
        ws.Cell(1, 1).Style.Font.Bold = true;
        ws.Cell(1, 1).Style.Font.FontSize = 14;
        ws.Cell(2, 1).Value = $"Фирма: {companyName}";
        ws.Cell(3, 1).Value = $"Период: {periodLabel}";
        ws.Cell(4, 1).Value = $"Режим: {kindLabel}";
        ws.Cell(5, 1).Value = $"Работник: {workerLabel}";

        int row = 7;
        if (period == "year")
        {
            row = WriteYearTable(ws, row, entries, mk);
        }
        else
        {
            bool notes = period == "day";
            if (filterUser.HasValue)
            {
                WriteDocTypeTable(ws, row, entries, notes);
            }
            else
            {
                var workers = entries
                    .GroupBy(e => e.UserId)
                    .Select(g => (Name: $"{g.First().User.FirstName} {g.First().User.LastName}", Items: g.ToList()))
                    .OrderBy(w => w.Name).ToList();
                foreach (var w in workers)
                {
                    ws.Cell(row, 1).Value = w.Name;
                    ws.Range(row, 1, row, notes ? 6 : 5).Merge();
                    ws.Row(row).Style.Font.Bold = true;
                    ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#E8EAF6");
                    row++;
                    row = WriteDocTypeTable(ws, row, w.Items, notes) + 1;
                }
                if (workers.Count == 0)
                    ws.Cell(row, 1).Value = "Нема податоци за избраниот период.";
            }
        }

        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return File(ms.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"RabotnoVreme-{period}-{d:yyyyMMdd}.xlsx");
    }

    private static int WriteDocTypeTable(IXLWorksheet ws, int row, List<WorkTimeEntry> entries, bool includeNotes)
    {
        int c = 1;
        ws.Cell(row, c++).Value = "Бр.";
        ws.Cell(row, c++).Value = "Тип на документ";
        ws.Cell(row, c++).Value = "Документи";
        ws.Cell(row, c++).Value = "Минути";
        ws.Cell(row, c++).Value = "Просечно (мин/док)";
        if (includeNotes) ws.Cell(row, c++).Value = "Белешки";
        ws.Row(row).Style.Font.Bold = true;
        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#DBEAFE");
        row++;

        var byType = entries
            .GroupBy(e => new { e.WorkDocumentTypeId, e.DocumentType.Name, e.DocumentType.Order })
            .Select(g => new
            {
                g.Key.Name,
                g.Key.Order,
                Docs = g.Sum(e => e.DocumentCount),
                Minutes = g.Sum(e => e.Minutes),
                Notes = string.Join("; ", g.Where(e => !string.IsNullOrWhiteSpace(e.Notes)).Select(e => e.Notes))
            })
            .Where(x => x.Docs != 0 || x.Minutes != 0)
            .OrderBy(x => x.Order)
            .ToList();

        int idx = 1, totalDocs = 0, totalMin = 0;
        foreach (var t in byType)
        {
            int cc = 1;
            ws.Cell(row, cc++).Value = idx++;
            ws.Cell(row, cc++).Value = t.Name;
            ws.Cell(row, cc++).Value = t.Docs;
            ws.Cell(row, cc++).Value = t.Minutes;
            ws.Cell(row, cc++).Value = t.Docs > 0 ? Math.Round((double)t.Minutes / t.Docs, 1) : 0;
            if (includeNotes) ws.Cell(row, cc++).Value = t.Notes;
            totalDocs += t.Docs; totalMin += t.Minutes;
            row++;
        }

        ws.Cell(row, 2).Value = "Вкупно";
        ws.Cell(row, 3).Value = totalDocs;
        ws.Cell(row, 4).Value = totalMin;
        ws.Cell(row, 5).Value = totalDocs > 0 ? Math.Round((double)totalMin / totalDocs, 1) : 0;
        ws.Row(row).Style.Font.Bold = true;
        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#FEF9C3");
        return row;
    }

    private static int WriteYearTable(IXLWorksheet ws, int row, List<WorkTimeEntry> entries, string[] mk)
    {
        ws.Cell(row, 1).Value = "Месец";
        ws.Cell(row, 2).Value = "Документи";
        ws.Cell(row, 3).Value = "Минути";
        ws.Cell(row, 4).Value = "Просечно (мин/док)";
        ws.Row(row).Style.Font.Bold = true;
        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#DBEAFE");
        row++;

        var byMonth = entries
            .GroupBy(e => e.Date.Month)
            .ToDictionary(g => g.Key, g => (Docs: g.Sum(e => e.DocumentCount), Min: g.Sum(e => e.Minutes)));

        int totalDocs = 0, totalMin = 0;
        for (int m = 1; m <= 12; m++)
        {
            byMonth.TryGetValue(m, out var v);
            ws.Cell(row, 1).Value = mk[m - 1];
            ws.Cell(row, 2).Value = v.Docs;
            ws.Cell(row, 3).Value = v.Min;
            ws.Cell(row, 4).Value = v.Docs > 0 ? Math.Round((double)v.Min / v.Docs, 1) : 0;
            totalDocs += v.Docs; totalMin += v.Min;
            row++;
        }
        ws.Cell(row, 1).Value = "Вкупно";
        ws.Cell(row, 2).Value = totalDocs;
        ws.Cell(row, 3).Value = totalMin;
        ws.Cell(row, 4).Value = totalDocs > 0 ? Math.Round((double)totalMin / totalDocs, 1) : 0;
        ws.Row(row).Style.Font.Bold = true;
        ws.Row(row).Style.Fill.BackgroundColor = XLColor.FromHtml("#FEF9C3");
        return row;
    }
}

public record WorkTimeCompanyRequest(string Name);
public record WorkDocumentTypeRequest(string Name);
public record WorkTimeEntryRequest(string Date, int CompanyId, int DocumentTypeId, int DocumentCount, int Minutes, string? Notes, int? UserId, int Kind = 0);
