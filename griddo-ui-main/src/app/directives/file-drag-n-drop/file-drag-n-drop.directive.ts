import { Directive, HostListener, HostBinding, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[fileDragDrop]'
})

export class FileDragNDropDirective {
  //@Input() private allowed_extensions : Array<string> = ['png', 'jpg', 'bmp'];
  @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  //@Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') private background = "#ffffff";
  @HostBinding('style.border') private borderStyle = "1px solid #ced4da";
  // @HostBinding('style.border-color') private borderColor = "#ced4da";
  @HostBinding('style.border-radius') private borderRadius = "0.5rem";

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderStyle = '1px dashed';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';
    // this.borderColor = '#ced4da';
    this.borderStyle = '1px solid #ced4da';
    this.borderRadius = "0.5rem";
  }

  @HostListener('drop', ['$event']) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#ffffff';
    // this.borderColor = '#ced4da';
    this.borderStyle = '1px solid #ced4da';
    this.borderRadius = "0.5rem";
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    this.filesChangeEmiter.emit(valid_files);
  }
}