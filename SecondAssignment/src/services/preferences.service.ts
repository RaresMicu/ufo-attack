import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor() {}

  saveUfos(UFOs: string): void {
    localStorage.setItem('UFOs', UFOs);
  }

  saveCountdown(countdown: string): void {
    localStorage.setItem('countdown', countdown);
  }

  getUfos(): number {
    return parseInt(localStorage.getItem('UFOs')!);
  }

  getCountdown(): number {
    return parseInt(localStorage.getItem('countdown')!);
  }
}
