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
import { EmployeesService, TerminationEmailPreview } from '../employees.service';

interface DialogData { companyId: number; employeeId: number; }
type SendState = 'idle' | 'sending' | 'success' | 'error';

interface EmailItem {
  preview: TerminationEmailPreview;
  editSubject: string;
  editBody: string;
  sendState: SendState;
  errorMessage: string | null;
  resetting: boolean;
  expanded: boolean;
  showLivePreview: boolean;
}

@Component({
  selector: 'app-termination-emails-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="title-icon">mail_lock</mat-icon>
      Известувања за одјава
    </h2>

    <mat-dialog-content>

      @if (loading()) {
        <div class="center-spinner"><mat-spinner diameter="36" /></div>

      } @else if (items().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">mark_email_read</mat-icon>
          <p>Нема активни извршни налози — нема известувања за испраќање.</p>
        </div>

      } @else {

        <p class="intro-text">
          Работникот е одјавен. Подолу се подготвени известувања до секој извршител
          со активен или редиран налог. Прегледај и испрати пред да ја затвориш.
        </p>

        @for (item of items(); track item.preview.orderId; let i = $index) {
          <div class="email-card" [class.expanded]="item.expanded">

            <!-- Card header -->
            <div class="card-header" (click)="toggleExpand(i)">
              <div class="card-header-left">
                <mat-icon class="order-icon">gavel</mat-icon>
                <div class="card-header-info">
                  <span class="order-number">И.бр. {{ item.preview.orderNumber }}</span>
                  <span class="executor-meta">{{ item.preview.executorName }} · {{ item.preview.executorEmail }}</span>
                </div>
              </div>
              <div class="card-header-right">
                @if (item.preview.isSent && item.sendState === 'idle') {
                  <span class="badge badge-sent">
                    <mat-icon>check_circle</mat-icon> Испратен
                  </span>
                } @else if (item.sendState === 'success') {
                  <span class="badge badge-sent">
                    <mat-icon>check_circle</mat-icon> Испратен
                  </span>
                } @else if (item.sendState === 'error') {
                  <span class="badge badge-error">
                    <mat-icon>error</mat-icon> Грешка
                  </span>
                } @else {
                  <span class="badge badge-pending">
                    <mat-icon>schedule</mat-icon> Нe испратен
                  </span>
                }
                <mat-icon class="expand-icon">{{ item.expanded ? 'expand_less' : 'expand_more' }}</mat-icon>
              </div>
            </div>

            <!-- Expanded editor -->
            @if (item.expanded) {
              <div class="card-body">

                <div class="meta-row">
                  <span class="meta-label">До:</span>
                  <span class="meta-value">{{ item.preview.executorEmail }}</span>
                </div>

                <mat-form-field appearance="outline" class="full-width" style="margin-top:10px">
                  <mat-label>Наслов</mat-label>
                  <input matInput
                    [ngModel]="item.editSubject"
                    (ngModelChange)="updateField(i, 'editSubject', $event)" />
                </mat-form-field>

                <div class="section-label">Порака</div>
                <div class="email-compose">
                  <div class="compose-static">Почитувани,</div>
                  <textarea
                    class="compose-textarea"
                    [ngModel]="item.editBody"
                    (ngModelChange)="updateField(i, 'editBody', $event)"
                    rows="5"
                    placeholder="Внеси ја содржината на пораката..."></textarea>
                  <div class="compose-static footer-static">
                    Со почит,<br><strong>{{ item.preview.senderName }}</strong>
                  </div>
                </div>

                <div class="preview-toggle">
                  <button mat-button (click)="togglePreview(i)">
                    <mat-icon>{{ item.showLivePreview ? 'visibility_off' : 'visibility' }}</mat-icon>
                    {{ item.showLivePreview ? 'Сокриј преглед' : 'Прикажи преглед' }}
                  </button>
                </div>

                @if (item.showLivePreview) {
                  <div class="email-preview" [innerHTML]="getLivePreview(item)"></div>
                }

                <!-- Feedback -->
                @if (item.sendState === 'success') {
                  <div class="feedback success">
                    <mat-icon>check_circle</mat-icon>
                    <span>Мејлот е успешно испратен до <strong>{{ item.preview.executorEmail }}</strong></span>
                  </div>
                }
                @if (item.sendState === 'error') {
                  <div class="feedback error">
                    <mat-icon>error</mat-icon>
                    <div>
                      <strong>Мејлот не можеше да се испрати.</strong>
                      @if (item.errorMessage) {
                        <div class="error-detail">{{ item.errorMessage }}</div>
                      }
                      <div class="error-hint">Провери ги SMTP поставките.</div>
                    </div>
                  </div>
                }
                @if (item.preview.isSent && item.sendState === 'idle') {
                  <div class="feedback already-sent">
                    <mat-icon>mark_email_read</mat-icon>
                    <div>
                      Испратен на {{ item.preview.sentAt | date:'dd.MM.yyyy HH:mm' }}
                      <button mat-button class="reset-btn" (click)="resetSent(i)" [disabled]="item.resetting">
                        <mat-icon style="font-size:16px;height:16px;width:16px">refresh</mat-icon>
                        {{ item.resetting ? 'Се ресетира...' : 'Ресетирај' }}
                      </button>
                    </div>
                  </div>
                }

                <!-- Send button -->
                <div class="card-actions">
                  <button mat-flat-button color="primary"
                    (click)="send(i)"
                    [disabled]="item.sendState === 'sending' || !item.editBody.trim()">
                    @if (item.sendState === 'sending') {
                      <mat-spinner diameter="18" style="display:inline-block;margin-right:6px" />
                    } @else {
                      <mat-icon>send</mat-icon>
                    }
                    {{ item.sendState === 'sending' ? 'Се испраќа...' : 'Испрати' }}
                  </button>
                </div>

              </div>
            }
          </div>
        }
      }

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button mat-dialog-close color="basic">Затвори</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 8px; }
    .title-icon { color: #e53935; }
    mat-dialog-content { width: 620px; max-width: 96vw; padding-bottom: 8px; }
    .center-spinner { display: flex; justify-content: center; padding: 40px; }

    .intro-text { font-size: 13px; color: rgba(0,0,0,0.6); margin: 0 0 16px; line-height: 1.5; }

    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 32px; color: rgba(0,0,0,0.45); }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; }

    /* Card */
    .email-card {
      border: 1px solid rgba(0,0,0,0.15);
      border-radius: 10px;
      margin-bottom: 12px;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .email-card.expanded { border-color: #3949ab; }

    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px;
      cursor: pointer;
      background: #fafafa;
      user-select: none;
    }
    .card-header:hover { background: #f0f0f0; }
    .card-header-left { display: flex; align-items: center; gap: 10px; }
    .order-icon { color: #5c6bc0; }
    .card-header-info { display: flex; flex-direction: column; gap: 2px; }
    .order-number { font-weight: 600; font-size: 14px; }
    .executor-meta { font-size: 12px; color: rgba(0,0,0,0.5); }
    .card-header-right { display: flex; align-items: center; gap: 8px; }
    .expand-icon { color: rgba(0,0,0,0.4); }

    /* Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 12px; }
    .badge mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .badge-sent { background: #e8f5e9; color: #2e7d32; }
    .badge-pending { background: #fff8e1; color: #e65100; }
    .badge-error { background: #ffebee; color: #c62828; }

    /* Card body */
    .card-body { padding: 16px; border-top: 1px solid rgba(0,0,0,0.08); }

    .meta-row { display: flex; gap: 8px; align-items: center; font-size: 13px; margin-bottom: 4px; }
    .meta-label { color: rgba(0,0,0,0.54); min-width: 40px; font-weight: 500; }
    .meta-value { color: rgba(0,0,0,0.87); }
    .full-width { width: 100%; }
    .section-label { font-size: 11px; font-weight: 600; color: rgba(0,0,0,0.45); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; margin-top: 4px; }

    .email-compose {
      border: 1px solid rgba(0,0,0,0.23); border-radius: 8px; overflow: hidden; background: #fff;
    }
    .email-compose:focus-within { border-color: #3949ab; }
    .compose-static {
      padding: 10px 14px; font-size: 13px; color: rgba(0,0,0,0.6);
      background: #fafafa; border-bottom: 1px solid rgba(0,0,0,0.08); line-height: 1.5;
    }
    .footer-static { border-top: 1px solid rgba(0,0,0,0.08); border-bottom: none; }
    .compose-textarea {
      width: 100%; padding: 12px 14px; font-size: 13px; font-family: Arial, sans-serif;
      line-height: 1.6; border: none; outline: none; resize: vertical;
      color: rgba(0,0,0,0.87); box-sizing: border-box;
    }

    .preview-toggle { margin-top: 8px; }
    .preview-toggle button { font-size: 12px; color: rgba(0,0,0,0.45); }
    .email-preview {
      margin-top: 8px; padding: 16px; background: #fafafa;
      border: 1px solid #e0e0e0; border-radius: 8px; font-size: 13px;
      line-height: 1.6; max-height: 180px; overflow-y: auto;
    }

    .feedback {
      display: flex; align-items: flex-start; gap: 10px;
      margin-top: 12px; padding: 10px 14px; border-radius: 8px; font-size: 13px;
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
    .reset-btn { font-size: 11px; height: 24px; padding: 0 8px; margin-left: 8px; }

    .card-actions { display: flex; justify-content: flex-end; margin-top: 14px; }
  `]
})
export class TerminationEmailsDialogComponent implements OnInit {
  private data = inject<DialogData>(MAT_DIALOG_DATA);
  private service = inject(EmployeesService);
  private sanitizer = inject(DomSanitizer);
  dialogRef = inject(MatDialogRef<TerminationEmailsDialogComponent>);

  loading = signal(true);
  items = signal<EmailItem[]>([]);

  ngOnInit(): void {
    this.service.getTerminationEmails(this.data.companyId, this.data.employeeId).subscribe({
      next: previews => {
        this.items.set(previews.map((p, i) => ({
          preview: p,
          editSubject: p.subject,
          editBody: p.contentText,
          sendState: 'idle',
          errorMessage: null,
          resetting: false,
          expanded: i === 0,   // first item expanded by default
          showLivePreview: false
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleExpand(i: number): void {
    this.items.update(arr => arr.map((item, idx) =>
      idx === i ? { ...item, expanded: !item.expanded } : item
    ));
  }

  togglePreview(i: number): void {
    this.items.update(arr => arr.map((item, idx) =>
      idx === i ? { ...item, showLivePreview: !item.showLivePreview } : item
    ));
  }

  updateField(i: number, field: 'editSubject' | 'editBody', value: string): void {
    this.items.update(arr => arr.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    ));
  }

  getLivePreview(item: EmailItem): SafeHtml {
    const escaped = item.editBody
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    const html = `<div style="font-family:Arial,sans-serif;font-size:13px;color:#333;line-height:1.6">
      <p>Почитувани,</p>
      <p>${escaped}</p>
      <br>
      <p>Со почит,<br><strong>${item.preview.senderName}</strong></p>
    </div>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  send(i: number): void {
    const item = this.items()[i];
    if (!item.preview.emailLogId) return;

    this.items.update(arr => arr.map((x, idx) =>
      idx === i ? { ...x, sendState: 'sending' as SendState, errorMessage: null } : x
    ));

    this.service.sendTerminationEmail(
      this.data.companyId, this.data.employeeId,
      item.preview.emailLogId,
      item.editSubject,
      item.editBody
    ).subscribe({
      next: res => {
        if (res.success) {
          this.items.update(arr => arr.map((x, idx) =>
            idx === i ? {
              ...x,
              sendState: 'success' as SendState,
              preview: { ...x.preview, isSent: true, sentAt: new Date().toISOString() }
            } : x
          ));
        } else {
          this.items.update(arr => arr.map((x, idx) =>
            idx === i ? { ...x, sendState: 'error' as SendState, errorMessage: res.error ?? 'Непозната грешка' } : x
          ));
        }
      },
      error: () => {
        this.items.update(arr => arr.map((x, idx) =>
          idx === i ? { ...x, sendState: 'error' as SendState, errorMessage: 'Серверска грешка.' } : x
        ));
      }
    });
  }

  resetSent(i: number): void {
    const item = this.items()[i];
    if (!item.preview.emailLogId) return;

    this.items.update(arr => arr.map((x, idx) =>
      idx === i ? { ...x, resetting: true } : x
    ));

    this.service.resetTerminationEmail(
      this.data.companyId, this.data.employeeId, item.preview.emailLogId
    ).subscribe({
      next: () => {
        this.items.update(arr => arr.map((x, idx) =>
          idx === i ? {
            ...x,
            resetting: false,
            sendState: 'idle' as SendState,
            preview: { ...x.preview, isSent: false, sentAt: null }
          } : x
        ));
      },
      error: () => {
        this.items.update(arr => arr.map((x, idx) =>
          idx === i ? { ...x, resetting: false } : x
        ));
      }
    });
  }
}
