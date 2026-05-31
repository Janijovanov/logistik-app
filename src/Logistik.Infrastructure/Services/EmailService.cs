using Logistik.Application.Common.Interfaces;
using Logistik.Domain.Entities;
using Logistik.Domain.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace Logistik.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;
    private readonly IUnitOfWork _uow;

    public EmailService(IConfiguration config, ILogger<EmailService> logger, IUnitOfWork uow)
    {
        _config = config;
        _logger = logger;
        _uow = uow;
    }

    public async Task SendAsync(string to, string subject, string body, CancellationToken ct = default)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _config["EmailSettings:SenderName"],
            _config["EmailSettings:SenderEmail"]));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        var host = _config["EmailSettings:SmtpHost"]!;
        var port = int.Parse(_config["EmailSettings:SmtpPort"]!);
        var username = _config["EmailSettings:Username"]!;
        var password = _config["EmailSettings:Password"]!;

        using var client = new SmtpClient();
        // Port 587 uses STARTTLS; port 465 uses SSL
        var socketOption = port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
        await client.ConnectAsync(host, port, socketOption, ct);
        await client.AuthenticateAsync(username, password, ct);
        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }

    public async Task QueueAsync(EmailLog emailLog, CancellationToken ct = default)
    {
        await _uow.EmailLogs.AddAsync(emailLog, ct);
        await _uow.SaveChangesAsync(ct);

        try
        {
            await SendAsync(emailLog.RecipientEmail, emailLog.Subject, emailLog.Body, ct);
            emailLog.IsSent = true;
            emailLog.SentAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", emailLog.RecipientEmail);
            emailLog.ErrorMessage = ex.Message;
            emailLog.RetryCount++;
        }

        _uow.EmailLogs.Update(emailLog);
        await _uow.SaveChangesAsync(ct);
    }

    public async Task<bool> SendSavedAsync(EmailLog emailLog, CancellationToken ct = default)
    {
        try
        {
            await SendAsync(emailLog.RecipientEmail, emailLog.Subject, emailLog.Body, ct);
            emailLog.IsSent = true;
            emailLog.SentAt = DateTime.UtcNow;
            emailLog.ErrorMessage = null;
            _uow.EmailLogs.Update(emailLog);
            await _uow.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", emailLog.RecipientEmail);
            emailLog.ErrorMessage = ex.Message;
            emailLog.RetryCount++;
            _uow.EmailLogs.Update(emailLog);
            await _uow.SaveChangesAsync(ct);
            return false;
        }
    }

    public async Task RetryFailedAsync(CancellationToken ct = default)
    {
        var failed = await _uow.EmailLogs.GetFailedEmailsAsync(3, ct);
        foreach (var log in failed)
        {
            try
            {
                await SendAsync(log.RecipientEmail, log.Subject, log.Body, ct);
                log.IsSent = true;
                log.SentAt = DateTime.UtcNow;
                log.ErrorMessage = null;
            }
            catch (Exception ex)
            {
                log.ErrorMessage = ex.Message;
                log.RetryCount++;
            }

            _uow.EmailLogs.Update(log);
        }

        await _uow.SaveChangesAsync(ct);
    }
}
