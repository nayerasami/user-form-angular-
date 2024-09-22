import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private genericService :GenericService) { }


  AddUserExperience(data:any){
   return this.genericService.create('experience',data)
  }

  deleteUserExperience(id: any,userId:any){
    return this.genericService.delete(`experience/${id}/${userId}`)
  }


}
