import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-error',
  templateUrl: './shared-error.component.html',
  styleUrls: ['./shared-error.component.css']
})
export class SharedErrorComponent {
  @Input() errorMessages: any;
  @Input() control: any;



  getErrorKeys(): string[] {
    return this.control ? Object.keys(this.control.errors || {}) : [];
  }

  getErrorMessages(errorKey: any): string {
    return this.errorMessages[errorKey] || ''
  }
}
