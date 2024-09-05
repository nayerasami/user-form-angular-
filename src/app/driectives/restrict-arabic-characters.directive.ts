import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictArabicCharacters]'
})
export class RestrictArabicCharactersDirective {
  private regexPattern: any = /^[^\u0600-\u06ff]*$/;

  constructor(private elementRef: ElementRef) { }

  @HostListener('input', ['$event']) onTextChange(event: Event) {
    console.log(this.elementRef.nativeElement)
    const currentValue = this.elementRef.nativeElement.value

    if(!this.regexPattern.test(currentValue)){
      console.log("pattern doesn't match")
      this.elementRef.nativeElement.value=currentValue.replace(/[\u0600-\u06ff]/g,'')
      event.preventDefault()
    }
  }
}
