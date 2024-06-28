import { AbstractControl } from '@angular/forms';

export class DateValidator {
    static expiryDateVaidator(AC: AbstractControl) {
        if (AC && AC.value) {
            let expiryDate = new Date(AC.value);
            let currentDate = new Date();
            if (expiryDate > currentDate) {
                return null;
            } else{
                return { 'expiryDateVaidator': true };
            }

        }
        return null;
    }
}