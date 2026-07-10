import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'currencyMk', standalone: true })
export class CurrencyMkPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';
    // 'mk' locale → "." thousands separator (e.g. 27.500 ден.)
    return formatNumber(Math.round(value), 'mk', '1.0-0') + ' ден.';
  }
}
