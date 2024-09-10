import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-inputs-control',
  templateUrl: './multi-inputs-control.component.html',
  styleUrls: ['./multi-inputs-control.component.css']
})
export class MultiInputsControlComponent {
  @Input() controlOptions: any;
  @Input() formArrayName:any
  controls: any[] = []
  // inputControlForm!: FormGroup;
  isSubmitted: boolean = false;
  formControls: any;
  maxAddedControls: any;
  controlsArr: any;
  defaultValues: any;

  ngOnInit(): void {
    this.controls = this.controlOptions.inputsArray
    this.formArrayName = new FormGroup({
      controlsArray: new FormArray([], this.controlOptions.formArrayValidators)
    })

    this.addNewControl();
    this.setDefaultValues()


  }


  setDefaultValues() {
    this.defaultValues = this.controlOptions.defaultControlValues
    if (this.defaultValues) {
      while (this.defaultValues.length > this.getControlsArr.controls.length) {
        this.addNewControl()
        const controls = this.getControlsArr.controls
        this.defaultValues.forEach((value: any, index: number) => {
          if (controls[index]) {
            controls[index].patchValue(value)
          }
        })
      }
    }
  }



  reset() {
    while (this.getControlsArr.length > 1) {
      this.deleteControl(1);
    }
    this.formArrayName.reset();
  }

  createNewFormGroup() {
    const formGroup: any = {}
    this.controls.forEach((control: any) => {
      formGroup[control.name] = new FormControl('', control.validators || []);

    });
    return new FormGroup(formGroup)
  }


  get getControlsArr(): FormArray {
    return this.formArrayName.get('controlsArray') as FormArray;
  }



  addControl() {
    if (this.formArrayName.status == 'VALID') {
      this.isSubmitted = false;
      this.addNewControl()
    } else {
      this.isSubmitted = true
    }

  }


  addNewControl() {
    const newFormGroup = this.createNewFormGroup()
    if (this.controlOptions.formGroupValidators) {
      newFormGroup.setValidators(this.controlOptions.formGroupValidators)
    }
    this.getControlsArr.push(newFormGroup)
  }




  validate() {
    console.log(this.formArrayName.value, "submitted ")
    if (this.formArrayName.status == 'VALID') {
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true
    }

  }

  deleteControl(index: any) {
    this.getControlsArr.removeAt(index)
  }

  update() {
    if (this.controlOptions.updatedDataValues) {
      while (this.controlOptions.updatedDataValues.length > this.getControlsArr.controls.length) {
        this.addNewControl()

      }
      this.controlOptions.updatedDataValues.forEach((el: any, index: number) => {

        this.getControlsArr.controls[index].patchValue(el)

      })
    }
  }

}
