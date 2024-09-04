import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms"

export class CustomValidator {


    static checkDateValidity(control: AbstractControl): ValidationErrors | null {
        const currentDate = Date.now()
        const selectedDate = new Date(control.value).getTime()

        return selectedDate <= currentDate ? null : { invalidDate: true }

    }



    static checkEndDateAndJoinDate(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const joinDate = group.get('joinDate')?.value
            const endDate = group.get('endDate')?.value

            if (!joinDate || !endDate) {
                return null
            }
            const joinDateTime = new Date(joinDate).getTime();
            const endDateTime = new Date(endDate).getTime();
            if (endDateTime <= joinDateTime) {
                return { inappropriateDate: true }

            } else {
                return null;
            }
        }

    }


    static checkWorkingStatus(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const experienceControl = group.get('experience');
            const endDateControl = group.get('endDate');
            const experienceValue = experienceControl?.value;
            const endDateValue = endDateControl?.value;

            if ((!experienceValue && experienceControl?.dirty) && (!endDateValue && endDateControl?.dirty)) {
                return { requiredEndDate: true };
            }

            if (experienceValue && endDateValue) {
                return null;
            }


            return null;

        }
    }


    static checkArrayMaxLength(control: AbstractControl): ValidationErrors | null {


        if (control instanceof FormArray) {
            const controls = control.controls
            if (controls.length >= 4) {
                return { formArrayLength: true };

            }
            return null

        }
        return null;
    }
}