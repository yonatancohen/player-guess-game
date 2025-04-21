import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'game'
})
export class GamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
