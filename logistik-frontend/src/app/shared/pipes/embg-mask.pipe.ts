import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'embgMask', standalone: true })
export class EmbgMaskPipe implements PipeTransform {
  transform(value: string | null | undefined, masked = true): string {
    if (!value) return '-';
    if (!masked || value.length !== 13) return value;
    return value.substring(0, 7) + '******';
  }
}
