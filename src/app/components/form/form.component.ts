import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/customValidators'
import { ImultiInputAttributes, ImultiInputOptions } from 'src/app/Models/multi-input-options';
import { MultiInputsControlComponent } from '../Shared/multi-inputs-control/multi-inputs-control.component';
import { ReusableDdlComponent } from '../Shared/reusable-ddl/reusable-ddl.component';
import { IddlOptions } from 'src/app/Models/ddl-options';
import { IpickListItems, IpickListOptions } from 'src/app/Models/pick-list-options';
import { IformInputsOptions, IformInputsOptionsAttributes } from 'src/app/Models/form-inputs-options';
import { ReusablePickListComponent } from '../Shared/reusable-pick-list/reusable-pick-list.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {
  @ViewChild('formInputControl') formInputControlRef !: MultiInputsControlComponent;
  @ViewChild('dropList') dropListRef!: ReusableDdlComponent;
  @ViewChild('pickListEl') pickListRef!: ReusablePickListComponent;


  userForm: FormGroup = new FormGroup({});
  inputControlFormArray: any;
  // userInfoFormGroup: any;
  selectedData: any = ''
  loading = false;
  validators: any;
  pickedItems: any;

  // userFormGroup: string = 'userInfo';
  // inputControlArrayName: string = 'inputControlForm';

  constructor(private cdr: ChangeDetectorRef) { }



  ngOnInit(): void {
    this.userForm = new FormGroup({
      userInfo: new FormGroup({
        firstNameAR: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastNameAR: new FormControl('', [Validators.required, Validators.minLength(3)]),
        firstNameEn: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastNameEn: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') ]),
        phone: new FormControl('', [Validators.required ,Validators.pattern('^[0-9]+$')]),
        nationalId: new FormControl('', [Validators.required ,Validators.pattern('^[0-9]+$')]),
        birthDate: new FormControl('', [
          Validators.required,
          CustomValidator.checkDateValidity
        ]),
        addressAr: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150)
        ]),
        addressEn: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150)
        ]),
        gender: new FormControl(''),
        maritalStatus: new FormControl('')
      }),
      inputControlForm: new FormArray([]),
      permissions: new FormControl('')
    });
  }




  getControl(controlName: any): FormControl {
    return this.userForm.get(`userInfo.${controlName}`) as FormControl;
  }




  //DDLs  
  genderOptionsArr: any[] = ['Male', 'Female']
  maritalStatusOptionsArr: any[] = ['Married', 'Single', 'Divorced', 'Widower']

  genderDDLConfig: IddlOptions = {
    isMultiValued: false,
    isResettable: false,
    isSearchable: false,
    defaultValue: 'select your gender',
    validators: {
      function: (array: any): any => {
        if (this.genderDDLConfig.isMultiValued) {
          if (array.length === 0) {
            return 'This field is required';
          } else if (array.length < 3) {
            return 'You must select at least 3 options';
          } else {
            return undefined;
          }
        } else {
          if (!array || array.length === 0) {
            return 'You must select your gender';
          } else {
            return undefined;
          }
        }

      }
    }
  }

  maritalStatusDDLConfig: IddlOptions = {
    isMultiValued: false,
    isResettable: false,
    isSearchable: false,
    defaultValue: 'select your marital status',
    validators: {
      function: (array: any): any => {
        if (this.genderDDLConfig.isMultiValued) {
          if (array.length === 0) {
            return 'This field is required';
          } else if (array.length < 3) {
            return 'You must select at least 3 options';
          } else {
            return undefined;
          }
        } else {
          if (!array || array.length === 0) {
            return 'You must select your marital status';
          } else {
            return undefined;
          }
        }

      }
    }
  }


  getSelectedData(e: string, controlName: any) {
    this.selectedData = e
    this.userForm.get(controlName)?.setValue(this.selectedData, { emitEvent: false })
    console.log(this.selectedData)
    console.log(this.userForm.get(controlName))
  }

  //multi inputs control

  multiInputAttributes: ImultiInputAttributes[] = [
    {
      type: 'text',
      label: 'Company Name',
      name: 'companyName',
      inputType: 'text',
      validators: [
        Validators.minLength(4),
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid Company name',
        minlength: 'company name must be at least 4'
      }
    },
    {

      type: 'date',
      label: 'Join Date',
      name: 'joinDate',
      inputType: 'text',
      validators: [
        Validators.required,
        CustomValidator.checkDateValidity
      ],
      errorMessages: {
        requiredMessage: 'Enter Valid join date',
        invalidDate: 'The date must be in the past'

      }
    },
    {
      type: 'date',
      label: 'End Date',
      name: 'endDate',
      inputType: 'text',
      validators: [
        CustomValidator.checkDateValidity

      ],
      errorMessages: {
        invalidDate: 'The date must be in the past'

      }
    }, {
      type: 'checkbox',
      label: 'experience',
      name: 'experience',
      inputType: 'checkbox',
      value: 'currently working',
      validators: [

      ],
      errorMessages: {

      }
    },
  ]

  multiInputsOptions: ImultiInputOptions = {
    inputsArray: this.multiInputAttributes,
    formGroupValidators: [
      CustomValidator.checkEndDateAndJoinDate(),
      CustomValidator.checkWorkingStatus()
    ],
    errorMessages: {
      inappropriateDate: 'End date is set before the start date',
      requiredEndDate: 'You must enter the job status'
    },
    formArrayValidators: [CustomValidator.checkArrayMaxLength],
    formArrayErrors: {
      formArrayLength: "you can't add more "
    },
  }



  //pick-list

  pickListItems: any[] = ['Adding', 'Editing', 'Deleting']

  pickListOptions: IpickListOptions = {
    itemsArr: this.pickListItems,
    //defaultValuesArr: this.defaultValues,
    uniqueKey: 'id',
    showKey: 'name',
    isSearchable: false,
    isSortable: true,
    validators: {
      function: (array: any): any => {
        if (!array || array.length === 0) {
          return 'User Must have at least one permission';
        } else {
          return undefined;
        }

      }
    }
    //defaultAddedArr: this.defaultAdded,
    //defaultDeleted:this.defaultDeleted
  }


  ngAfterViewInit(): void {
    this.inputControlFormArray = this.formInputControlRef.formArrayName.get('controlsArray') as FormArray;
    if (this.inputControlFormArray.controls.length > 1) {
      this.inputControlFormArray.controls.forEach((formGroupControl: any) => {
        if (formGroupControl instanceof FormGroup) {
          this.handleGroupValuesChange(formGroupControl)
        }
      })

    }
    this.cdr.detectChanges();
    this.handleExperienceStatus();


  }


  handleGroupValuesChange(group: any) {
    const currentlyWorkingControl = group?.get('experience');
    const endDateControl = group?.get('endDate');
    if (currentlyWorkingControl.value) {
      endDateControl.disable({ emitEvent: false });
    } else if (endDateControl.value) {
      currentlyWorkingControl.disable({ emitEvent: false });
    }


    currentlyWorkingControl?.valueChanges.subscribe((value: any) => {
      if (value) {
        endDateControl?.disable({ emitEvent: false });
      } else {
        endDateControl?.enable({ emitEvent: false });
      }
    });

    endDateControl?.valueChanges.subscribe((value: any) => {
      if (value) {
        currentlyWorkingControl?.disable({ emitEvent: false });
      } else {
        currentlyWorkingControl?.enable({ emitEvent: false });
      }
    });



  }

  handleExperienceStatus() {
    if (this.inputControlFormArray) {


      this.inputControlFormArray.valueChanges.subscribe(() => {
        this.inputControlFormArray.controls.forEach((controlGroup: any) => {

          if (controlGroup instanceof FormGroup) {
            this.handleGroupValuesChange(controlGroup);
          }
        });
      })
    }
  }

  getPickedItems(event: any) {
    this.pickListItems = event;
    console.log(this.pickListItems, "permissions")

    // console.log(this.userForm.get('permissions'), "ll")
     this.userForm.get('permissions')?.setValue(this.pickListItems, { emitEvent: false })


  }


  onFormSubmit() {

    const formArrayData = this.formInputControlRef.formArrayName.value;
    const inputControlFormArray = this.userForm.get('inputControlForm') as FormArray;
    formArrayData.controlsArray.forEach((data: any) => {
      const newFormGroup = new FormGroup({});
      console.log(Object.keys(data) ,"lll")
      Object.keys(data).forEach(key => {
        newFormGroup.addControl(key, new FormControl(data[key]));
      });
      inputControlFormArray.push(newFormGroup);
    });

    this.pickListRef.saveSelectedValues()
    console.log(this.userForm.value, "user data");
  }




}
