import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../services/crypto.service';
import { SettingsService } from '../../services/settings.service';
import { EncryptionResult, EncryptionStep } from '../../models/encryption.model';

@Component({
  selector: 'app-decryption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './decryption.component.html',
  styleUrls: ['./decryption.component.scss']
})
export class DecryptionComponent {
  decryptInput: string = '';
  decryptP: string = '61';
  decryptQ: string = '53';
  decryptSeed: string = '12';
  decryptResult: string = '';
  decryptionSteps: EncryptionStep[] = [];
  showResult: boolean = false;
  showSteps: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private cryptoService: CryptoService,
    private settingsService: SettingsService
  ) {}

  decrypt(): void {
    if (!this.decryptInput.trim() || !this.decryptP.trim() || !this.decryptQ.trim() || !this.decryptSeed.trim()) {
      this.errorMessage = '❌ Please enter encrypted text, P, Q, and Seed values';
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.cryptoService.decrypt(
        this.decryptInput,
        this.decryptP,
        this.decryptQ,
        this.decryptSeed
      ).subscribe({
        next: (response: EncryptionResult) => {
          this.decryptResult = response.ciphertextHex;
          this.decryptionSteps = response.steps || [];
          this.showResult = true;
          this.isLoading = false;

          if (this.settingsService.getSetting('autoCopy')) {
            this.copyToClipboard();
          }

          if (this.settingsService.getSetting('showSteps')) {
            console.log(
              `[Decryption] Decrypted ${this.decryptInput.length} characters`,
              response
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = `❌ Decryption failed: ${error.message || 'Unknown error'}`;
          console.error('Decryption error:', error);
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = `❌ ${error instanceof Error ? error.message : 'Decryption failed'}`;
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.decryptResult).then(() => {
      console.log('✅ Copied to clipboard!');
    });
  }

  clearForm(): void {
    this.decryptInput = '';
    this.decryptP = '61';
    this.decryptQ = '53';
    this.decryptSeed = '12';
    this.decryptResult = '';
    this.decryptionSteps = [];
    this.showResult = false;
    this.showSteps = false;
    this.errorMessage = '';
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }
}
