import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from './services/settings.service';
import { EncryptionComponent } from './components/encryption/encryption.component';
import { DecryptionComponent } from './components/decryption/decryption.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RouletteComponent } from './components/roulette/roulette.component';
import { CardShuffleComponent } from './components/card-shuffle/card-shuffle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EncryptionComponent, DecryptionComponent, SettingsComponent, RouletteComponent, CardShuffleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  activeTab: string = 'encryption';
  tabs = ['encryption', 'decryption', 'roulette', 'card-shuffle', 'settings'];
  tabLabels = {
    encryption: '🔐 Encryption',
    decryption: '🔓 Decryption',
    roulette: '🎰 Roulette',
    'card-shuffle': '🂡 Card Shuffle',
    settings: '⚙️ Settings'
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Restore active tab from settings
    const savedTab = this.settingsService.getSetting('activeTab');
    if (this.tabs.includes(savedTab)) {
      this.activeTab = savedTab;
    }
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
    this.settingsService.updateSettings({ activeTab: tabName });
  }

  isActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  getTabLabel(tab: string): string {
    const key = tab as keyof typeof this.tabLabels;
    return this.tabLabels[key] || tab;
  }
}
