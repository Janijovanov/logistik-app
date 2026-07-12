namespace Logistik.Application.Common.Interfaces;

public interface IExportService
{
    Task<byte[]> ExportEmployeeToPdfAsync(int employeeId, string lang = "mk", CancellationToken ct = default);
    Task<byte[]> ExportEmployeeToExcelAsync(int employeeId, string lang = "mk", CancellationToken ct = default);
    Task<byte[]> ExportEnforcementOrderToPdfAsync(int orderId, CancellationToken ct = default);
    Task<byte[]> ExportEnforcementOrderToExcelAsync(int orderId, CancellationToken ct = default);
    Task<byte[]> ExportCompanyEmployeesToExcelAsync(int companyId, CancellationToken ct = default);
    Task<byte[]> ExportPaymentOrderPdfAsync(int salaryRecordId, bool overflow = false, CancellationToken ct = default);
    Task<byte[]> ExportEnforcementDeductionsToExcelAsync(int companyId, int year, int month, CancellationToken ct = default);
}
