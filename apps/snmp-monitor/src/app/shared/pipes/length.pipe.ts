import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {
  transform(value: string, limit: number, ellipsis: string): string {
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
