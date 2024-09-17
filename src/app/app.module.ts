import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ReusableDdlComponent } from './components/Shared/reusable-ddl/reusable-ddl.component';
import { MultiInputsControlComponent } from './components/Shared/multi-inputs-control/multi-inputs-control.component';
import { ReusablePickListComponent } from './components/Shared/reusable-pick-list/reusable-pick-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedErrorComponent } from './components/Shared/shared-error/shared-error.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomDirective } from './driectives/custom.directive';
import { UsersComponent } from './components/users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ReusableDdlComponent,
    MultiInputsControlComponent,
    ReusablePickListComponent,
    SharedErrorComponent,
    CustomDirective,
    UsersComponent,
    NotFoundComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    AppRoutingModule,
  

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
