import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EnforcementOrdersService, EmailPreview } from '../enforcement-orders.service';

interface DialogData { companyId: number; employeeId: number; orderId: number; }
type SendState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-email-preview-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="title-icon">email</mat-icon>
      Извести го извршителот
    </h2>

    <mat-dialog-content>
      @if (loading()) {
        <div class="center-spinner"><mat-spinner diameter="36" /></div>

      } @else if (loadError()) {
        <div class="feedback error">
          <mat-icon>error</mat-icon>
          <div>
            <strong>Грешка при вчитување.</strong>
            <div class="error-detail">{{ loadError() }}</div>
          </div>
        </div>

      } @else {
        <!-- TO -->
        <div class="meta-row">
          <span class="meta-label">До:</span>
          <span class="meta-value">{{ preview()!.recipientEmail }}</span>
        </div>

        <!-- SUBJECT (editable) -->
        <mat-form-field appearance="outline" class="full-width" style="margin-top:10px">
          <mat-label>Наслов</mat-label>
          <input matInput [(ngModel)]="editSubject" />
        </mat-form-field>

        <!-- BODY EDITOR -->
        <div class="section-label">Порака</div>
        <div class="email-compose">
          <div class="compose-static">Почитувани,</div>
          <textarea
            class="compose-textarea"
            [(ngModel)]="editBody"
            rows="6"
            placeholder="Внеси ја содржината на пораката..."></textarea>
          <div class="compose-static footer-static">
            Со почит,<br><strong>{{ preview()!.senderName }}</strong>
          </div>
        </div>

        <!-- LIVE PREVIEW toggle -->
        <div class="preview-toggle">
          <button mat-button (click)="showPreview.set(!showPreview())">
            <mat-icon>{{ showPreview() ? 'visibility_off' : 'visibility' }}</mat-icon>
            {{ showPreview() ? 'Сокриј преглед' : 'Прикажи преглед' }}
          </button>
        </div>

        @if (showPreview()) {
          <div class="email-preview" [innerHTML]="livePreview()"></div>
        }

        <!-- FEEDBACK -->
        @if (sendState() === 'success') {
          <div class="feedback success">
            <mat-icon>check_circle</mat-icon>
            <span>Мејлот е успешно испратен до <strong>{{ preview()!.recipientEmail }}</strong></span>
          </div>
        }
        @if (sendState() === 'error') {
          <div class="feedback error">
            <mat-icon>error</mat-icon>
            <div>
              <strong>Мејлот не можеше да се испрати.</strong>
              @if (errorMessage()) {
                <div class="error-detail">{{ errorMessage() }}</div>
              }
              <div class="error-hint">Провери ги SMTP поставките (корисник/лозинка).</div>
            </div>
          </div>
        }
        @if (preview()!.isSent && sendState() === 'idle') {
          <div class="feedback already-sent">
            <mat-icon>mark_email_read</mat-icon>
            <div>
              Испратен на {{ preview()!.sentAt | date:'dd.MM.yyyy HH:mm' }}
              <button mat-button class="reset-btn" (click)="resetSent()" [disabled]="resetting()">
                <mat-icon style="font-size:16px;height:16px;width:16px">refresh</mat-icon>
                {{ resetting() ? 'Се ресетира...' : 'Ресетирај' }}
              </button>
            </div>
          </div>
        }
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Затвори</button>
      @if (!loading() && !loadError()) {
        <button mat-flat-button color="primary"
          (click)="send()"
          [disabled]="sendState() === 'sending' || !editBody().trim()">
          @if (sendState() === 'sending') {
            <mat-spinner diameter="18" style="display:inline-block;margin-right:6px" />
          } @else {
            <mat-icon>send</mat-icon>
          }
          {{ sendState() === 'sending' ? 'Се испраќа...' : 'Испрати' }}
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 8px; }
    .title-icon { color: #3949ab; }
    mat-dialog-content { width: 580px; max-width: 95vw; padding-bottom: 8px; }
    .center-spinner { display: flex; justify-content: center; padding: 40px; }

    .meta-row { display: flex; gap: 8px; align-items: center; font-size: 13px; margin-bottom: 4px; }
    .meta-label { color: rgba(0,0,0,0.54); min-width: 40px; font-weight: 500; }
    .meta-value { color: rgba(0,0,0,0.87); }
    .full-width { width: 100%; }

    .section-label { font-size: 11px; font-weight: 600; color: rgba(0,0,0,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; margin-top: 4px; }

    .email-compose {
      border: 1px solid rgba(0,0,0,0.23);
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }
    .email-compose:focus-within { border-color: #3949ab; }
    .compose-static {
      padding: 10px 14px;
      font-size: 13px;
      color: rgba(0,0,0,0.6);
      background: #fafafa;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      line-height: 1.5;
    }
    .footer-static {
      border-top: 1px solid rgba(0,0,0,0.08);
      border-bottom: none;
    }
    .compose-textarea {
      width: 100%;
      padding: 12px 14px;
      font-size: 13px;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      border: none;
      outline: none;
      resize: vertical;
      color: rgba(0,0,0,0.87);
      box-sizing: border-box;
    }

    .preview-toggle { margin-top: 8px; }
    .preview-toggle button { font-size: 12px; color: rgba(0,0,0,0.45); }

    .email-preview {
      margin-top: 8px;
      padding: 16px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.6;
      max-height: 200px;
      overflow-y: auto;
    }

    .feedback {
      display: flex; align-items: flex-start; gap: 10px;
      margin-top: 14px; padding: 12px 16px;
      border-radius: 8px; font-size: 13px;
    }
    .feedback mat-icon { flex-shrink: 0; margin-top: 1px; }
    .feedback.success { background: #e8f5e9; color: #2e7d32; }
    .feedback.success mat-icon { color: #2e7d32; }
    .feedback.error { background: #ffebee; color: #c62828; }
    .feedback.error mat-icon { color: #c62828; }
    .feedback.already-sent { background: #e3f2fd; color: #1565c0; font-size: 12px; }
    .feedback.already-sent mat-icon { color: #1565c0; }
    .error-detail { font-size: 11px; margin-top: 4px; font-family: monospace; word-break: break-all; opacity: 0.85; }
    .error-hint { font-size: 11px; margin-top: 4px; opacity: 0.7; font-style: italic; }
  `]
})
export class EmailPreviewDialogComponent implements OnInit {
  private data = inject<DialogData>(MAT_DIALOG_DATA);
  private service = inject(EnforcementOrdersService);
  private sanitizer = inject(DomSanitizer);
  dialogRef = inject(MatDialogRef<EmailPreviewDialogComponent>);

  loading = signal(true);
  loadError = signal<string | null>(null);
  preview = signal<EmailPreview | null>(null);
  sendState = signal<SendState>('idle');
  errorMessage = signal<string | null>(null);
  showPreview = signal(false);

  resetting = signal(false);

  editSubject = '';
  editBody = signal('');

  livePreview = computed((): SafeHtml => {
    const p = this.preview();
    if (!p) return '';
    const escaped = this.editBody()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    const html = `<div style="font-family:Arial,sans-serif;font-size:13px;color:#333;line-height:1.6">
      <p>Почитувани,</p>
      <p>${escaped}</p>
      <br>
      <p>Со почит,<br><strong>${p.senderName}</strong></p>
    </div>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  ngOnInit(): void {
    this.service.getEmailPreview(this.data.companyId, this.data.employeeId, this.data.orderId).subscribe({
      next: p => {
        this.preview.set(p);
        this.editSubject = p.subject;
        this.editBody.set(p.contentText);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.loadError.set(`HTTP ${err.status}: ${err.error?.message || err.message || 'Неочекувана грешка'}`);
      }
    });
  }

  resetSent(): void {
    this.resetting.set(true);
    this.service.resetNotification(this.data.companyId, this.data.employeeId, this.data.orderId).subscribe({
      next: () => {
        this.preview.update(p => p ? { ...p, isSent: false, sentAt: null } : p);
        this.sendState.set('idle');
        this.resetting.set(false);
      },
      error: () => this.resetting.set(false)
    });
  }

  send(): void {
    this.sendState.set('sending');
    this.errorMessage.set(null);
    this.service.sendNotification(
      this.data.companyId, this.data.employeeId, this.data.orderId,
      this.editSubject, this.editBody()
    ).subscribe({
      next: res => {
        if (res.success) {
          this.sendState.set('success');
          this.preview.update(p => p ? { ...p, isSent: true, sentAt: new Date().toISOString() } : p);
        } else {
          this.sendState.set('error');
          this.errorMessage.set(res.error ?? 'Непозната грешка');
        }
      },
      error: () => {
        this.sendState.set('error');
        this.errorMessage.set('Серверска грешка при испраќање.');
      }
    });
  }
}
