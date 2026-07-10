import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

/**
 * Date adapter that displays and parses dates in Macedonian style:
 * day.month.year (e.g. 02.11.2026). Accepts typed input with ".", "/"
 * or "-" separators and 2- or 4-digit years, so a user can type
 * "2.11.2026" (or "2/11/26") without opening the calendar.
 */
export class MkDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (value == null || value === '') return null;
    if (typeof value === 'string') {
      const m = value.trim().match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2,4})$/);
      if (m) {
        const day = +m[1];
        const month = +m[2];
        let year = +m[3];
        if (year < 100) year += 2000;
        if (month < 1 || month > 12 || day < 1 || day > 31) return null;
        return new Date(year, month - 1, day);
      }
      // Fall back to native parsing for other shapes
      const t = Date.parse(value);
      return isNaN(t) ? null : new Date(t);
    }
    return super.parse(value);
  }

  override format(date: Date, _displayFormat: any): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }

  // Monday-first calendar (Macedonian convention)
  override getFirstDayOfWeek(): number { return 1; }
}

export const MK_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
