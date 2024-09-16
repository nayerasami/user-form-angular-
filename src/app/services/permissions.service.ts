import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private genericService:GenericService) { }

  getAllPermissions(){
    return this.genericService.getAll('permissions')
  }
  
  addUserPermissions(data:any){

    return this.genericService.create('permissions/user-permission',data)
  }


  
}
