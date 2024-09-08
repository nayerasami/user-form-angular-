import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IformInputsOptionsAttributes } from 'src/app/Models/form-inputs-options';

@Component({
  selector: 'app-reusable-form-inputs',
  templateUrl: './reusable-form-inputs.component.html',
  styleUrls: ['./reusable-form-inputs.component.css'],

})
export class ReusableFormInputsComponent implements OnInit {
  @Input() options: any;
  @Input() formGroupName: any;
  inputsArr: IformInputsOptionsAttributes[] = [];
  ddlsOptions: any;
  loading = false;


  ngOnInit(): void {
    this.inputsArr = this.options.optionsArr
    this.formGroupName = this.createNewFormGroup()

    this.ddlsOptions = this.options.DDLsOptions
    console.log(this.ddlsOptions, "ddlsOptions ngoninit")
    this.ddlsOptions.forEach((el: any) => {
      console.log(el, 'ddd')
    })
    //console.log(this.options.DDLsOptions, "DDLsOptions ngoninit")
  }

  getControlsEL(controlName: any): FormControl {
    return this.formGroupName.get(controlName) as FormControl;
  }


  createNewFormGroup() {
    const formGroup: any = {}
    this.inputsArr.forEach((control: any) => {
      formGroup[control.name] = new FormControl('', control.validators || []);
    });




    return new FormGroup(formGroup);
  }







}
