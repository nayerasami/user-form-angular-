import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IddlOptions } from 'src/app/Models/ddl-options';
import { IformInputsOptionsAttributes } from 'src/app/Models/form-inputs-options';

@Component({
  selector: 'app-reusable-form-inputs',
  templateUrl: './reusable-form-inputs.component.html',
  styleUrls: ['./reusable-form-inputs.component.css'],
  
})
export class ReusableFormInputsComponent implements OnInit {
  @Input() options: any;
  @Input() formGroupName: any;
  inputsArr: IformInputsOptionsAttributes[]=[];


  loading = false;

  genderDdlOptions: any = [
    'Male', 'female'
  ]
  maritalDdlOptions: any = [
    'married', 'single', 'divorced', 'widower'
  ]
  genderDdlconfig: IddlOptions = {
    label:'gender',
    isMultiValued: false,
    isResettable: false,
    isSearchable: false,
    uniqueKey: 'id',
    showKey: 'title',
    searchKey: 'code',
    defaultTitle: 'select your gender',
    options: this.genderDdlOptions,
  }

  maritalStatusDdl: IddlOptions = {
    isMultiValued: false,
    isResettable: false,
    isSearchable: false,
    uniqueKey: 'id',
    showKey: 'title',
    searchKey: 'code',
    defaultTitle: 'select your marital status',
    options: this.maritalDdlOptions,
    label:'marital status'
  }




  ngOnInit(): void {
    console.log(this.formGroupName, 'form group name')
    this.inputsArr = this.options.optionsArr
    this.formGroupName = this.createNewFormGroup()
    console.log(this.formGroupName ,"form group name")

  }

  getControlsEL(controlName:any): FormControl {
    return this.formGroupName.get(controlName) as FormControl;
  }


  createNewFormGroup() {
    const formGroup: any = {}
    this.inputsArr.forEach((control: any) => {
      formGroup[control.name] = new FormControl('', control.validators || []);
    });
    formGroup['gender'] = new FormControl('');
    formGroup['maritalStatus'] = new FormControl('');
    return new FormGroup(formGroup);
  }







}
