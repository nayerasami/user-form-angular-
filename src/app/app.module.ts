import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ReusableDdlComponent } from './components/Shared/reusable-ddl/reusable-ddl.component';
import { MultiInputsControlComponent } from './components/Shared/multi-inputs-control/multi-inputs-control.component';
import { ReusablePickListComponent } from './components/Shared/reusable-pick-list/reusable-pick-list.component';
import { ReusableFormInputsComponent } from './components/Shared/reusable-form-inputs/reusable-form-inputs.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ReusableDdlComponent,
    MultiInputsControlComponent,
    ReusablePickListComponent,
    ReusableFormInputsComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
