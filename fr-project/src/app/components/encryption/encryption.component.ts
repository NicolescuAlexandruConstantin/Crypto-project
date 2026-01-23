import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../../services/crypto.service';
import { SettingsService } from '../../services/settings.service';
import { EncryptionResult, EncryptionStep } from '../../models/encryption.model';

@Component({
  selector: 'app-encryption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})
export class EncryptionComponent {
  encryptInput: string = '';
  encryptP: string = '61';
  encryptQ: string = '53';
  encryptSeed: string = '12';
  encryptResult: string = '';
  encryptionSteps: EncryptionStep[] = [];
  showResult: boolean = false;
  showSteps: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private cryptoService: CryptoService,
    private settingsService: SettingsService
  ) {}

  encrypt(): void {
    if (!this.encryptInput.trim() || !this.encryptP.trim() || !this.encryptQ.trim() || !this.encryptSeed.trim()) {
      this.errorMessage = '❌ Please enter text, P, Q, and Seed values';
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.cryptoService.encrypt(
        this.encryptInput,
        this.encryptP,
        this.encryptQ,
        this.encryptSeed
      ).subscribe({
        next: (response: EncryptionResult) => {
          this.encryptResult = response.ciphertextHex;
          this.encryptionSteps = response.steps || [];
          this.showResult = true;
          this.isLoading = false;

          if (this.settingsService.getSetting('autoCopy')) {
            this.copyToClipboard();
          }

          if (this.settingsService.getSetting('showSteps')) {
            console.log(
              `[Encryption] Encrypted ${this.encryptInput.length} characters`,
              response
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = `❌ Encryption failed: ${error.message || 'Unknown error'}`;
          console.error('Encryption error:', error);
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = `❌ ${error instanceof Error ? error.message : 'Encryption failed'}`;
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.encryptResult).then(() => {
      console.log('✅ Copied to clipboard!');
    });
  }

  clearForm(): void {
    this.encryptInput = '';
    this.encryptP = '61';
    this.encryptQ = '53';
    this.encryptSeed = '12';
    this.encryptResult = '';
    this.encryptionSteps = [];
    this.showResult = false;
    this.showSteps = false;
    this.errorMessage = '';
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }
}
