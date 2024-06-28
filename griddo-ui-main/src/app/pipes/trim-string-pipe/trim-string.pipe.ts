import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "trimstring"
})
export class TrimStringPipe implements PipeTransform {
    transform(value?: string | null | undefined): any {
        if (value) {
            const trimedStr = value.trim();
            return trimedStr;
        }
        return '';
    }
}
