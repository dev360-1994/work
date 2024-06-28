import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "search"
})
export class SearchPipe implements PipeTransform {
    transform(list: any[], value: string, key: string): any {
        if (value) {
            list = list.filter((item) => {
                return (item[key]
                    .toString()
                    .toLowerCase()
                    .includes(value?.toString().toLowerCase()))
            });
        }
        return list;
    }
}
