import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('userExperienceControl') formInputControlRef !: MultiInputsControlComponent;
  @ViewChild('genderDropList') genderDropListRef!: ReusableDdlComponent;
  @ViewChild('maritalDropList') maritalDropListRef !: ReusableDdlComponent;
  @ViewChild('pickListEl') pickListRef!: ReusablePickListComponent;
  @ViewChild('phoneKey') phoneKeyRef !: ReusableDdlComponent;

  userForm: FormGroup = new FormGroup({});
  inputControlFormArray: any;
  selectedData: any = ''
  loading = false;
  validators: any;
  pickedItems: any;
  isEdit: boolean = false;
  userPermissionsArr: any
  experiencesValues: any;

  isSubmitted: boolean = false;

  user_id: any;
  timeOut: any;
  subscriptions: Subscription[] = []
  permissionsDefaultValues: any
  experiencesDefaultValues: any

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private permissionService: PermissionsService,
    private experienceService: ExperienceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }



  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.user_id = params.get('id');
      if (this.user_id) {
        this.isEdit = true;
        this.getSpecificUserData(this.user_id)
      }
    })


    this.getPickListItems()
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
          !this.isEdit ? [CustomValidator.emailAsyncValidator(this.userService)] : []
        ),

        phoneKey: new FormControl('')
        ,
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
          !this.isEdit ? [CustomValidator.phoneAsyncValidator(this.userService)] : []
        ),
        nationalID: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
          !this.isEdit ? [CustomValidator.nationalIDValidator(this.userService)] : []
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
          Validators.pattern('^[a-zA-Z ]+$')

        ]),
        gender: new FormControl(''),
        maritalStatus: new FormControl('')
      }),
      userExperience: new FormControl([]),
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
            return 'You must select country key';
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
      label: 'id',
      initialValue: null,
      name: 'id',
      inputType: 'hidden',
    },
    {
      type: 'text',
      label: 'Company Name',
      name: 'companyName',
      initialValue: 'company one',
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
      name: 'startDate',
      initialValue: "2022-08-03",
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
      name: 'currentlyWorking',
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
    //defaultControlValues: this.defaultValues,
  }

  ngAfterViewInit(): void {

    const controlsArray = this.formInputControlRef.inputControlForm.get('controlsArray') as FormArray;
    this.inputControlFormArray = controlsArray;
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
    const currentlyWorkingControl = group?.get('currentlyWorking');
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


  getExperiencesValues(e: any) {
    this.experiencesValues = e;
    this.userForm.get('userExperience')?.setValue(this.experiencesValues.controlsArray, { emitEvent: false })

  }

  //pick-list

  pickListItems: any[] = []

  getPickListItems() {
    const pickListSubscription = this.permissionService.getAllPermissions().subscribe({
      next: (response: any) => {
        this.pickListRef.setPickListItems(response.data.permissions)
        if (this.isEdit) {
          this.pickListRef.setPickedItems(this.userPermissionsArr)
        }
      },
      error: (error: any) => {
        console.log(error.message, "err")
      }
    })
    this.subscriptions.push(pickListSubscription)
  }

  pickListOptions: IpickListOptions = {
    itemsArr: this.pickListItems,
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

  }


  setPickedItemsValue(event: any) {
    this.pickListItems = event;
    console.log(this.pickListItems, "permissions")
    this.userForm.get('permissions')?.setValue(this.pickListItems, { emitEvent: false })
  }


  //form submitting

  onFormSubmit() {
    this.pickListRef.validate()
    this.formInputControlRef.validate()
    this.genderDropListRef.validate()
    this.maritalDropListRef.validate()
    this.phoneKeyRef.validate()
    this.pickListRef.saveSelectedValues()
    if (
      this.userForm.valid &&
      !this.pickListRef.hasError &&
      !this.genderDropListRef.hasError &&
      !this.maritalDropListRef.hasError &&
      !this.phoneKeyRef.hasError &&
      !this.formInputControlRef.hasError
    ) {
      this.isSubmitted = true;
      const permissionsData = {
        permissions: this.userForm.value.permissions.map((permission: any) => ({
          permissionId: permission.id,
        })),
      };

      if (!this.isEdit) {
        const userExperiencesArr = this.userForm.value.userExperience.map((exp: any) => {
          return {
            companyName: exp.companyName,
            startDate:exp.startDate,
            endDate: exp.endDate ,
            currentlyWorking: exp.currentlyWorking
          }
        })
        const postData = { ...this.userForm.value.userInfo, userExperience: userExperiencesArr, ...permissionsData }
        this.addUserData(postData)

      } else {
        const postData = { ...this.userForm.value.userInfo, userExperience: this.userForm.value.userExperience, ...permissionsData }
        this.editUserData(this.user_id, postData)
      }

    } else {
      this.isSubmitted = false;
      this.userForm.markAllAsTouched()
    }



  }


  addUserData(userInfo: any) {
    const createUserSubscription = this.userService.createUser(userInfo).subscribe({
      next: (response: any) => {
        console.log(response,"response")
        this.timeOut = setTimeout(() => {
          this.userForm.reset()
          this.router.navigate(['/']);
        }, 3000);
      }, error: (err: any) => {
        this.isSubmitted = false;
        console.log(err.message, "error")
      }
    })

    this.subscriptions.push(createUserSubscription)
  }



  editUserData(id: any, updatedData: any) {
    const editUserSubscription = this.userService.updateUser(id, updatedData).subscribe({
      next: (response: any) => {
        console.log(response, "response")
        this.timeOut = setTimeout(() => {
          this.userForm.reset()
          this.router.navigate(['/']);
        }, 3000);
      }, error: (err: any) => {
        this.isSubmitted = false;
        console.log(err.message, "error")
      }
    })
    this.subscriptions.push(editUserSubscription)

  }


  getSpecificUserData(id: any) {
    const getUserSubscription = this.userService.getOneUser(id).subscribe({
      next: (response: any) => {
        this.populateForm(response.data.user)
        this.phoneKeyRef.setSelectItems([
          {
            id: response.data.user.phoneKey,
            countryKey: response.data.user.country.countryKey,
            countryName: response.data.user.country.countryName
          }
        ])

        this.genderDropListRef.setSelectItems([response.data.user.gender])
        this.maritalDropListRef.setSelectItems([response.data.user.maritalStatus])

        this.userPermissionsArr = response.data.user.permissions.map((permission: any) => {
          return { id: permission.id, permission: permission.permission };
        });

        const userExperienceArray = response.data.user.userExperience.map((experience: any) => {
          return {
            id: experience.id,
            companyName: experience.companyName,
            startDate: new Date(experience.startDate).toISOString().split('T')[0],
            endDate: experience.endDate === null ? null : new Date(experience.endDate).toISOString().split('T')[0],
            currentlyWorking: experience.currentlyWorking
          }

        })


        this.formInputControlRef.setControlsValues(userExperienceArray)

      }, error: (err: any) => {
        console.log(err.message, "error")
      }
    })

    this.subscriptions.push(getUserSubscription)
  }



  populateForm(userDetails: any): void {
    console.log(userDetails, "userDetails data")
    this.userForm.get('userInfo')?.patchValue({
      firstNameAR: userDetails.firstNameAR,
      lastNameAR: userDetails.lastNameAR,
      firstNameEN: userDetails.firstNameEN,
      lastNameEN: userDetails.lastNameEN,
      email: userDetails.email,
      phoneKey: userDetails.phoneKey,
      phoneNumber: userDetails.phoneNumber,
      nationalID: userDetails.nationalID,
      birthDate: new Date(userDetails.birthDate).toISOString().split('T')[0],
      addressAr: userDetails.addressAr,
      addressEN: userDetails.addressEN,
      gender: userDetails.gender,
      maritalStatus: userDetails.maritalStatus
    });

  }



  ngOnDestroy(): void {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []

  }


}
