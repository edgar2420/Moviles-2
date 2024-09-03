import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  // Store data in local storage
  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  // Retrieve data from local storage
  getItem(key: string){
    return localStorage.getItem(key);
  }

  // Remove data from local storage
  removeItem(key: string){
    localStorage.removeItem(key);
  }
}