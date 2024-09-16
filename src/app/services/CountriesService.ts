import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private genericService:GenericService) { }

  getAllCountries (){
    return this.genericService.getAll('countries')
  }


}
