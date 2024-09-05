import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/customValidators'
import { ImultiInputAttributes, ImultiInputOptions } from 'src/app/Models/multi-input-options';
import { MultiInputsControlComponent } from '../Shared/multi-inputs-control/multi-inputs-control.component';
import { ReusableDdlComponent } from '../Shared/reusable-ddl/reusable-ddl.component';
import { IddlOptions } from 'src/app/Models/ddl-options';
import { IpickListItems, IpickListOptions } from 'src/app/Models/pick-list-options';
import { IformInputsOptions, IformInputsOptionsAttributes } from 'src/app/Models/form-inputs-options';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {
  @ViewChild('formInputControl') formInputControlRef !: MultiInputsControlComponent;
  @ViewChild('dropList') dropListRef!: ReusableDdlComponent;
  userForm: FormGroup = new FormGroup({});
  inputControlFormArray: any;
  selectedData: any = ''
  loading = false;
  validators: any;
  userFormGroup: any
  inputControlArrayName:any
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userFormGroup = 'userInfo'
    this.inputControlArrayName ='inputControlForm'
    this.userForm = new FormGroup({
      userInfo: new FormGroup({

      }),
      inputControlForm: new FormArray([])
    });

    console.log(this.userForm.get('userInfo') as FormGroup)
  }


  inputsAttributes: IformInputsOptionsAttributes[] = [
    {
      type: 'text',
      label: 'الاسم الاول',
      name: 'firstNameAR',
      validators: [
        Validators.minLength(3),
        Validators.required
      ],
      errorMessages: {
        required: 'ادخل اسم مستخدم صحيح',
        minlength: 'اسم المستخدم يجب الا يقل عن 3 حروف'
      }
    },
    {
      type: 'text',
      label: 'الاسم الثاني ',
      name: 'lastNameAR',
      validators: [
        Validators.minLength(3),
        Validators.required
      ],
      errorMessages: {
        required: 'ادخل اسم مستخدم صحيح',
        minlength: 'اسم المستخدم يجب الا يقل عن 3 حروف'
      }
    },
    {
      type: 'text',
      label: 'first name ',
      name: 'firstNameEn',
      validators: [
        Validators.minLength(3),
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid Name',
        minlength: 'First Name must be at least 3'
      }
    },
    {
      type: 'text',
      label: 'last name ',
      name: 'lastNameEn',
      validators: [
        Validators.minLength(3),
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid Name',
        minlength: 'First Name must be at least 3'
      }
    },
    {
      type: 'email',
      label: 'email',
      name: 'email',
      validators: [
        Validators.required,
        Validators.email
      ],
      errorMessages: {
        required: 'Enter Valid email',
        email: 'enter valid email format'
      }
    },
    {
      type: 'number',
      label: 'phone',
      name: 'phone',
      validators: [
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid phone number',

      }
    },
    {
      type: 'number',
      label: 'nationalID',
      name: 'nationalID',
      validators: [
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid National ID'
      }
    }
    , {
      type: 'date',
      label: 'birth date',
      name: 'birthDate',
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
      type: 'text',
      label: 'arabic address',
      name: 'addressAR',
      validators: [
        Validators.minLength(8),
        Validators.required
      ],
      errorMessages: {
        required: 'ادخل عنوان صحيح',
        minlength: 'يجب الا يقل العنوان عن 8 حروف'
      }
    },
    {
      type: 'text',
      label: 'english address',
      name: 'addressEn',
      validators: [
        Validators.minLength(8),
        Validators.required
      ],
      errorMessages: {
        required: 'Enter Valid Address',
        minlength: 'Address must be at least 8'
      }
    },
  ]

  formInputsOptions: IformInputsOptions = {
    optionsArr: this.inputsAttributes,


  }

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

  // genderDdlOptions: any = [
  //   'Male', 'female'
  // ]
  // maritalDdlOptions: any = [
  //   'married', 'single', 'divorced', 'widower'
  // ]
  // genderDdlconfig: IddlOptions = {
  //   label:'gender',
  //   isMultiValued: false,
  //   isResettable: false,
  //   isSearchable: false,
  //   uniqueKey: 'id',
  //   showKey: 'title',
  //   searchKey: 'code',
  //   defaultTitle: 'select your gender',
  //   options: this.genderDdlOptions,

  // }

  // maritalStatusDdl: IddlOptions = {
  //   isMultiValued: false,
  //   isResettable: false,
  //   isSearchable: false,
  //   uniqueKey: 'id',
  //   showKey: 'title',
  //   searchKey: 'code',
  //   defaultTitle: 'select your marital status',
  //   options: this.maritalDdlOptions,
  //   label:'marital status'
  // }
  pickListItems: any[] = ['admin', 'super admin', 'user']

  pickListOptions: IpickListOptions = {
    itemsArr: this.pickListItems,
    // defaultValuesArr: this.defaultValues,
    uniqueKey: 'id',
    showKey: 'name',
    isSearchable: false,
    isSortable: true,
    //defaultAddedArr: this.defaultAdded,
    //defaultDeleted:this.defaultDeleted
  }



  ngAfterViewInit(): void {
    const controlsArray = this.formInputControlRef.formArrayName.get('controlsArray') as FormArray;
    this.inputControlFormArray = controlsArray;

    if (this.inputControlFormArray.controls.length > 1) {
      this.inputControlFormArray.controls.forEach((formGroupControl: any) => {
        if (formGroupControl instanceof FormGroup) {
          this.handleGroupValuesChange(formGroupControl)
        }
      })

      this.cdr.detectChanges();
    }



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


  onSubmit() {

  }




}
