import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyMk', standalone: true })
export class CurrencyMkPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';
    return new Intl.NumberFormat('mk-MK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' ден.';
  }
}
