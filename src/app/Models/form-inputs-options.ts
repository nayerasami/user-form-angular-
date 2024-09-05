import { ValidatorFn } from "@angular/forms";

export interface IformInputsOptionsAttributes {
    type: string;
    label: string;
    name: string;
    validators: ValidatorFn[];
    errorMessages: ErrorMessages
}
interface ErrorMessages {
    [key: string]: string;
  } 
export interface IformInputsOptions {
    optionsArr: IformInputsOptionsAttributes[];
}
