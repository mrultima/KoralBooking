import { Directive, ElementRef, HostListener } from '@angular/core';
import { isNumeric } from 'rxjs/internal-compatibility';

@Directive({
  selector: '[taCoreDigitOnly],[taCoreTextOnly]'
})
export class DigitOrTextOnlyDirective {
  mode: 'digit' | 'text' = 'digit';
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
    '+'
  ];
  inputElement: HTMLElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
    this.mode = this.inputElement.attributes.hasOwnProperty('tacoredigitonly') ? 'digit' : 'text';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      ((e.key === 'a' || e.key === 'A') && e.ctrlKey === true) || // Allow: Ctrl+A
      ((e.key === 'c' || e.key === 'C') && e.ctrlKey === true) || // Allow: Ctrl+C
      ((e.key === 'v' || e.key === 'V') && e.ctrlKey === true) || // Allow: Ctrl+V
      ((e.key === 'x' || e.key === 'X') && e.ctrlKey === true) || // Allow: Ctrl+X
      ((e.key === 'a' || e.key === 'A') && e.metaKey === true) || // Allow: Cmd+A (Mac)
      ((e.key === 'c' || e.key === 'C') && e.metaKey === true) || // Allow: Cmd+C (Mac)
      ((e.key === 'v' || e.key === 'V') && e.metaKey === true) || // Allow: Cmd+V (Mac)
      ((e.key === 'x' || e.key === 'X') && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
        (e.key !== undefined) && 
          (
            (!isNumeric(e.key) && this.mode === 'digit') ||
            (e.key.search(/[^a-zA-ZüğşöçıÜĞŞÖÇİ ]/g) > -1 && this.mode === 'text')
          )
        ) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData.getData('text/plain');
    if (this.mode === 'digit') {
      pastedInput.replace(/\D/g, '');
    } else {
      pastedInput.replace(/[^a-zA-ZüğşöçıÜĞŞÖÇİ ]/g, '');
    }
    // Doesn't work with mozilla Firefox
    {
      document.execCommand('insertText', false, pastedInput);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text');
    if (this.mode === 'digit') {
      textData.replace(/\D/g, '');
    } else {
      textData.replace(/[^a-zA-ZüğşöçıÜĞŞÖÇİ ]/g, '');
    }
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }
}
