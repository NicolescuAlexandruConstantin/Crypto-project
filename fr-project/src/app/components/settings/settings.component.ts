import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, AppSettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  themes = ['light', 'dark', 'auto'];

  constructor(readonly settingsService: SettingsService) {}

  get settings$() {
    return this.settingsService.settings$;
  }
  
  updateAutoCopy(value: boolean): void {
    this.settingsService.updateSettings({ autoCopy: value });
  }

  updateShowSteps(value: boolean): void {
    this.settingsService.updateSettings({ showSteps: value });
  }

  updateTheme(theme: string): void {
    this.settingsService.updateSettings({
      theme: theme as 'light' | 'dark' | 'auto'
    });
  }
}
