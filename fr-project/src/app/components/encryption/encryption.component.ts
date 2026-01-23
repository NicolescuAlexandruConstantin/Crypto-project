import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
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
  isShaking: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private settingsService: SettingsService
  ) {}

  private isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  private triggerShake(msg: string): void {
    this.errorMessage = msg;
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 500);
  }

  encrypt(): void {
    this.errorMessage = '';
    this.showResult = false;

    const pStr = String(this.encryptP).trim();
    const qStr = String(this.encryptQ).trim();
    const sStr = String(this.encryptSeed).trim();

    if (!this.encryptInput.trim() || !pStr || !qStr || !sStr) {
      this.triggerShake('❌ Please fill in all fields.');
      return;
    }

    const pVal = Number(pStr);
    const qVal = Number(qStr);

    if (isNaN(pVal) || isNaN(qVal)) {
      this.triggerShake('❌ P and Q must be valid numbers.');
      return;
    }

    if (!this.isPrime(pVal) || !this.isPrime(qVal)) {
      this.triggerShake('❌ Security Risk: Both P and Q must be prime numbers.');
      return;
    }

    this.isLoading = true;

    this.cryptoService.encrypt(this.encryptInput, pStr, qStr, sStr)
      .pipe(
        finalize(() => {
          setTimeout(() => this.isLoading = false, 100);
        })
      )
      .subscribe({
        next: (response: EncryptionResult) => {
          this.encryptResult = response.ciphertextHex;
          // Ensure this line correctly maps 'steps' from your backend response
          this.encryptionSteps = response.steps || [];
          this.showResult = true;

          if (this.settingsService.getSetting('autoCopy')) {
            this.copyToClipboard();
          }
        },
        error: (error) => {
          const errorMsg = error.error?.message || error.message || 'Server Error';
          this.triggerShake(`❌ Encryption failed: ${errorMsg}`);
        }
      });
  }

  copyToClipboard(): void {
    if (!this.encryptResult) return;
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
    this.isLoading = false;
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }
}
