import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrimStringPipe } from './trim-string.pipe';


@NgModule({
    imports: [CommonModule],
    declarations: [TrimStringPipe],
    exports: [TrimStringPipe]
})
export class TrimStringPipeModule { }
