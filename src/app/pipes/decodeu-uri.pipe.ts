import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeuUri'
})
export class DecodeuUriPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return decodeURI(JSON.parse('"' + value + '"'));
    }

    return value;
  }

}
