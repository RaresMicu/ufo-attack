import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  templateUrl: `./preferences.component.html`,
  styleUrls: ['./preferences.component.css'],
  imports: [CommonModule, FormsModule],
})
export class PreferencesComponent {
  constructor(private preference: PreferencesService) {}

  selectedUFOs: string = localStorage.getItem('UFOs') || '1';
  selectedTime: string = localStorage.getItem('countdown') || '60';

  savePreferences() {
    this.preference.saveUfos(this.selectedUFOs);
    this.preference.saveCountdown(this.selectedTime);
  }
}
