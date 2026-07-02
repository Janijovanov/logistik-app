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
        CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
            return BadRequest(new { message = "Невалиден датум." });

        var query = _db.WorkTimeEntries
            .Include(e => e.DocumentType)
            .Include(e => e.User)
            .Where(e => e.Date == parsedDate && e.WorkTimeCompanyId == companyId);

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
              && e.Date == parsedDate,
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
                Notes = req.Notes?.Trim()
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
}

public record WorkTimeCompanyRequest(string Name);
public record WorkDocumentTypeRequest(string Name);
public record WorkTimeEntryRequest(string Date, int CompanyId, int DocumentTypeId, int DocumentCount, int Minutes, string? Notes, int? UserId);
