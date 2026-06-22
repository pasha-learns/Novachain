import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'errorMessage', standalone: true, pure: true })
export class ErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null, messages: Record<string, string>): string | null {
    if (!errors) return null;
    for (const key of Object.keys(messages)) {
      if (errors[key]) return messages[key];
    }
    return null;
  }
}
