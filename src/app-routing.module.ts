import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './app/components/users/users.component';
import { FormComponent } from './app/components/form/form.component';


const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: '/add-user', component: FormComponent },

];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
