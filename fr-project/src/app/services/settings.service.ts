import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppSettings {
  autoCopy: boolean;
  showSteps: boolean;
  theme: 'light' | 'dark' | 'auto';
  activeTab: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoCopy: true,
  showSteps: true,
  theme: 'light',
  activeTab: 'encryption'
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings());
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.applyTheme(this.settingsSubject.value.theme);
  }

  private loadSettings(): AppSettings {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }

  updateSettings(updates: Partial<AppSettings>): void {
    const current = this.settingsSubject.value;
    const updated = { ...current, ...updates };
    this.settingsSubject.next(updated);
    localStorage.setItem('appSettings', JSON.stringify(updated));

    if (updates.theme) {
      this.applyTheme(updates.theme);
    }
  }

  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.settingsSubject.value[key];
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  private applyTheme(theme: string): void {
    const isDark =
      theme === 'dark' ||
      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}
