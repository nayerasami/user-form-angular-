import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[customDirective]'
})
export class CustomDirective {
  @Input() customDirective: string = '';
  private regexPattern: RegExp = /./;

  constructor(private elementRef: ElementRef) { }
  ngOnInit(): void {
    // this.regexPattern = new RegExp(this.pattern)
    switch (this.customDirective) {
      case 'prevent special characters':
        this.regexPattern = /[!@#$%^&*(),.|]/g;
        break;
      case 'accept only characters':
        this.regexPattern = /[0-9\!@#$%^&*(),.|/]/g;
        break;
      case 'accept only numbers':
        this.regexPattern = /[A-Za-z\u0600-\u06ff\!@#$%^&*(),.|/]/g;
        break;
      case 'restrict arabic characters':
        this.regexPattern = /[\u0600-\u06ff]/g;
        break;

    }
  }




  @HostListener('input', ['$event'])
  onTextChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    if (currentValue.match(this.regexPattern)) {
      inputElement.value = currentValue.replace(this.regexPattern, '')
      event.preventDefault()
    }

  }

}
