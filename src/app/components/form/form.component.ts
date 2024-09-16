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
import { UserService } from 'src/app/services/user.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { ExperienceService } from 'src/app/services/experience.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {
  @ViewChild('userExperienceControl') formInputControlRef !: MultiInputsControlComponent;
  @ViewChild('genderDropList') genderDropListRef!: ReusableDdlComponent;
  @ViewChild('maritalDropList') maritalDropListRef !: ReusableDdlComponent;
  @ViewChild('pickListEl') pickListRef!: ReusablePickListComponent;
  @ViewChild('phoneKey') phoneKeyRef !: ReusableDdlComponent;

  userForm: FormGroup = new FormGroup({});
  inputControlFormArray: any;
  // userInfoFormGroup: any;
  selectedData: any = ''
  loading = false;
  validators: any;
  pickedItems: any;

  isSubmitted: boolean = false;
  // userFormGroup: string = 'userInfo';
  // inputControlArrayName: string = 'inputControlForm';

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private permissionService: PermissionsService,
    private experienceService: ExperienceService
  ) { }



  ngOnInit(): void {
    this.userForm = new FormGroup({
      userInfo: new FormGroup({
        firstNameAR: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[\\u0600-\\u06FF\\s]+$')
        ]),
        lastNameAR: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[\\u0600-\\u06FF\\s]+$')
        ]),
        firstNameEN: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z\s]+$')
        ]),
        lastNameEN: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z\s]+$')
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),

        ],
          [CustomValidator.emailAsyncValidator(this.userService)]
        ),

        phoneKey: new FormControl('')
        ,
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
          [CustomValidator.phoneAsyncValidator(this.userService)]
        ),
        nationalID: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
          [CustomValidator.nationalIDValidator(this.userService)]
        ),
        birthDate: new FormControl('', [
          Validators.required,
          CustomValidator.checkDateValidity
        ]),
        addressAr: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
          Validators.pattern('^[\\u0600-\\u06FF\\s]+$')
        ]),
        addressEN: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(150),
          Validators.pattern('^[a-zA-Z\s]+$')

        ]),
        gender: new FormControl(''),
        maritalStatus: new FormControl('')
      }),
      userExperience: new FormArray([]),
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
    this.userForm.get(controlName)?.setValue(this.selectedData[0].id ? this.selectedData[0].id : this.selectedData[0], { emitEvent: false })
    console.log(this.selectedData)
    console.log(this.userForm.get(controlName))
  }


  phoneKeysDDLConfig: IddlOptions = {
    uniqueKey: 'id',
    isMultiValued: false,
    isSearchable: true,
    isResettable: true,
    showKey: 'countryKey',
    searchKey: 'countryName',
    baseUrl: 'http://localhost:7000/api/v1/countries',
    limit: 3,
    page: 1,
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

  setFormArrayValues() {
    const formArray = this.formInputControlRef.formArrayName;
    console.log(formArray, "formArray")
    if (formArray.status === 'VALID') {
      const inputControlFormArray = this.userForm.get('userExperience') as FormArray;
      console.log(formArray.value, "values")
      formArray.value.controlsArray.forEach((data: any) => {
        const newFormGroup = new FormGroup({});
        Object.keys(data).forEach(key => {
          newFormGroup.addControl(key, new FormControl(data[key]));
        });
        inputControlFormArray.push(newFormGroup);
      });
    }
  }

  //pick-list

  pickListItems: any[] = [{ id: 1, permission: 'Add' }, { id: 2, permission: 'delete' }, { id: 3, permission: 'update' }]

  // getPickListItems() {
  //   this.permissionService.getAllPermissions().subscribe({
  //     next: (response: any) => {
  //       console.log(response.data.permissions, "responseee");
  //       this.pickListItems = response.data.permissions;
  //       console.log(this.pickListItems, "picklist items response")
  //       this.pickListOptions.itemsArr= response.data.permissions
  //     },
  //     error: (err: any) => {
  //       console.log(err, "errrr");
  //     }
  //   });
  // }



  pickListOptions: IpickListOptions = {
    itemsArr: this.pickListItems,
    //defaultValuesArr: this.defaultValues,
    uniqueKey: 'id',
    showKey: 'permission',
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


  getPickedItems(event: any) {
    this.pickListItems = event;
    console.log(this.pickListItems, "permissions")
    this.userForm.get('permissions')?.setValue(this.pickListItems, { emitEvent: false })
  }


  //form submitting
  user_id: any;
  onFormSubmit() {
    this.pickListRef.validate()
    this.formInputControlRef.validate()

    this.genderDropListRef.validate()
    this.maritalDropListRef.validate()
    this.phoneKeyRef.validate()

    this.setFormArrayValues()
    this.pickListRef.saveSelectedValues()
    console.log(this.userForm, "user form ")

    // if (this.userForm.valid) {
    this.isSubmitted = true;
    console.log(this.userForm.value.userExperience,"userExperience value")
    this.addUserInfo(this.userForm.value.userInfo,this.userForm.value.userExperience,this.userForm.value.permissions)


   // console.log(this.userForm.value.userInfo, "user form values")


    // } else {
    //  this.userForm.markAllAsTouched()
    // }
  }


  addUserInfo(userInfo:any,userExperience:any,permissions:any){
      this.userService.createUser(userInfo).subscribe({
        next: (response: any) => {
          console.log(response.data.id, "responsee")
          this.user_id = response.data.id
         this.addUserExperience(userExperience)
         this.addUserPermission(permissions)
        }, error: (err: any) => {
          console.log(err, "error")
        }
      })
    
  }


 addUserExperience(userExperience: any[]) {
    userExperience.forEach(experience => {
      this.experienceService.AddUserExperience({ ...experience, user_id: this.user_id }).subscribe({
        next: (response: any) => {
          console.log('Experience added:', response);
        },
        error: (err: any) => {
          console.log('Error adding experience:', err);
        }
      });
    });
  }
  
addUserPermission(userPermissions:any[]){
userPermissions.forEach(permission=>{
  this.permissionService.addUserPermissions({...permission ,user_id:this.user_id}).subscribe({
    next:(response:any)=>{
      console.log(response,"permissions added")
    },
    error: (err: any) => {
      console.log('Error adding experience:', err);
    }
  })
})

}

  


}
