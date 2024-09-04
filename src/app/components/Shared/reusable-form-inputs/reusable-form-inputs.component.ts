import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reusable-form-inputs',
  templateUrl: './reusable-form-inputs.component.html',
  styleUrls: ['./reusable-form-inputs.component.css']
})
export class ReusableFormInputsComponent implements OnInit {
  @Input() options: any;
  inputsArr: any;
  userInfo: FormGroup = new FormGroup({})


  ngOnInit(): void {

    this.inputsArr = this.options.optionsArr
    this.userInfo = new FormGroup({
      firstNameAR:new FormControl('',[]),
      lastNameAR:new FormControl('',[]),
      firstNameEn:new FormControl('',[]),
      lastNameEn:new FormControl('',[]),
      email:new FormControl('',[]),
      phone:new FormControl('',[]),
      nationalID:new FormControl('',[]),
      birthDate:new FormControl('' ,[]),
      addressAR:new FormControl('',[]),
      addressEn :new FormControl('',[])
    })


  }



  get getControlsArr(): FormGroup {
    return this.userInfo.get('userInfo') as FormGroup;
  }

  
  // createNewFormGroup() {
  //   const formGroup: any = {}
  //   this.inputsArr.forEach((control: any) => {
  //     formGroup[control.name] = new FormControl('', control.validators || []);

  //   });
  //   return new FormGroup(formGroup)
  // }







}
