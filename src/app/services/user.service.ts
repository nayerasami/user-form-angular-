import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private genericService: GenericService) { }

  getAllUsers(): Observable<any> {
    return this.genericService.getAll('users')
  }

  getOneUser(id: any): Observable<any> {
    return this.genericService.getOne(`users/${id}`)

  }

  createUser(data: any): Observable<any> {
    return this.genericService.create('users', data)
  }


  updateUser(id: any, updatedData: any): Observable<any> {
    return this.genericService.update(`users/${id}`, updatedData)
  }


  deleteUser(id: any): Observable<any> {
    return this.genericService.delete(`users/${id}`)
  }

  checkEmailValidity(email: string) {
    return this.genericService.checkValidity(`users/check-email?email=${email}`)
  }

  checkNationalIDValidity (nationalID:any){
    return this.genericService.checkValidity(`users/check-national-id?nationalID=${nationalID}`)
  }

  checkPhoneNumberValidity(phoneNumber:any){
    return this.genericService.checkValidity(`users/check-phone?phoneNumber=${phoneNumber}`)
  }


}
