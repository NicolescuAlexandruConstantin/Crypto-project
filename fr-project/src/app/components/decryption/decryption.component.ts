import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../services/crypto.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-decryption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './decryption.component.html',
  styleUrls: ['./decryption.component.scss']
})
export class DecryptionComponent {
  decryptInput: string = '';
  decryptKey: string = '';
  decryptResult: string = '';
  showResult: boolean = false;
  isLoading: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private settingsService: SettingsService
  ) {}

  decrypt(): void {
    if (!this.decryptInput.trim() || !this.decryptKey.trim()) {
      alert('❌ Please enter both text and key');
      return;
    }

    try {
      this.isLoading = true;
      this.decryptResult = this.cryptoService.decrypt(
        this.decryptInput,
        this.decryptKey
      );
      this.showResult = true;

      if (this.settingsService.getSetting('autoCopy')) {
        this.copyToClipboard();
      }

      if (this.settingsService.getSetting('showSteps')) {
        console.log(
          `[Decryption] Decrypted ${this.decryptInput.length} characters`
        );
      }
    } catch (error) {
      alert(
        `❌ ${error instanceof Error ? error.message : 'Decryption failed'}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.decryptResult).then(() => {
      console.log('✅ Copied to clipboard!');
    });
  }

  clearForm(): void {
    this.decryptInput = '';
    this.decryptKey = '';
    this.decryptResult = '';
    this.showResult = false;
  }
}
