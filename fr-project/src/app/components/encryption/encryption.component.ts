import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../services/crypto.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-encryption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})
export class EncryptionComponent {
  encryptInput: string = '';
  encryptKey: string = '';
  encryptResult: string = '';
  showResult: boolean = false;
  isLoading: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private settingsService: SettingsService
  ) {}

  encrypt(): void {
    if (!this.encryptInput.trim() || !this.encryptKey.trim()) {
      alert('❌ Please enter both text and key');
      return;
    }

    try {
      this.isLoading = true;
      this.encryptResult = this.cryptoService.encrypt(
        this.encryptInput,
        this.encryptKey
      );
      this.showResult = true;

      if (this.settingsService.getSetting('autoCopy')) {
        this.copyToClipboard();
      }

      if (this.settingsService.getSetting('showSteps')) {
        console.log(
          `[Encryption] Encrypted ${this.encryptInput.length} characters`
        );
      }
    } catch (error) {
      alert(
        `❌ ${error instanceof Error ? error.message : 'Encryption failed'}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.encryptResult).then(() => {
      console.log('✅ Copied to clipboard!');
    });
  }

  clearForm(): void {
    this.encryptInput = '';
    this.encryptKey = '';
    this.encryptResult = '';
    this.showResult = false;
  }
}
