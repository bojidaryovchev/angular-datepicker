import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngDate'
})

export class NgDatePipe implements PipeTransform {
  transform(date: Date): number {
    return date.getDate();
  }
}
