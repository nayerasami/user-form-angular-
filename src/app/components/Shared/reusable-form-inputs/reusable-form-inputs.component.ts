import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reusable-form-inputs',
  templateUrl: './reusable-form-inputs.component.html',
  styleUrls: ['./reusable-form-inputs.component.css']
})
export class ReusableFormInputsComponent implements OnInit{
@Input() options:any;
inputsArr :any;
userInfo:FormGroup=new FormGroup({})


ngOnInit(): void {
this.inputsArr=this.options.optionsArr
this.userInfo =new FormGroup({

  
})
}





}
