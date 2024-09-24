import { AbstractControl, AsyncValidatorFn, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms"
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from "../services/user.service";
export class CustomValidator {

    static checkDateValidity(control: AbstractControl): ValidationErrors | null {
        const currentDate = Date.now()
        const selectedDate = new Date(control.value).getTime()

        return selectedDate <= currentDate ? null : { invalidDate: true }

    }



    static checkEndDateAndJoinDate(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const joinDate = group.get('startDate')?.value
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
            const experienceControl = group.get('currentlyWorking');
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
            if (controls.length >= 6) {
                return { formArrayLength: true };

            }
            return null

        }
        return null;
    }


    static emailAsyncValidator(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return userService.checkEmailValidity(control.value).pipe(
                map((response: any) => {

                    if (response && !response.exist) {
                        return null;
                    } else {
                        return { emailTaken: true };
                    }
                }),
                catchError(() => of({ emailTaken: true }))
            );
        }
    }

    static phoneAsyncValidator(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return userService.checkPhoneNumberValidity(control.value).pipe(
                map((response: any) => {

                    if (response && !response.exist) {
                        return null;
                    } else {
                        return { phoneTaken: true };
                    }
                }),
                catchError(() => of({ phoneTaken: true }))
            );
        }
    }


    static nationalIDValidator(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null >=> {
            if (!control.value) {
                return of(null)
            }

            return userService.checkNationalIDValidity(control.value).pipe(
                map((response: any) => {
                    if (response && !response.exist) {
                        return null;
                    } else {
                        return { nationalIDTaken: true }
                    }
                }),
                catchError(() => of({ nationalIDTaken: true }))
            )
        }
    }
}