import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
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
  decryptP: string = '71';
  decryptQ: string = '83';
  decryptSeed: string = '12';
  decryptResult: string = '';
  decryptionSteps: EncryptionStep[] = [];

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

  decrypt(): void {
    this.errorMessage = '';
    this.showResult = false;

    const pStr = String(this.decryptP).trim();
    const qStr = String(this.decryptQ).trim();
    const sStr = String(this.decryptSeed).trim();

    if (!this.decryptInput.trim() || !pStr || !qStr || !sStr) {
      this.triggerShake('Please enter encrypted text, P, Q, and Seed values');
      return;
    }

    const pVal = Number(pStr);
    const qVal = Number(qStr);
    const seedVal = Number(sStr);

    if (isNaN(pVal) || isNaN(qVal) || isNaN(seedVal)) {
      this.triggerShake('P, Q, and Seed must be valid numbers');
      return;
    }

    if (!this.isPrime(pVal) || !this.isPrime(qVal)) {
      this.triggerShake('Security Risk: Both P and Q must be prime numbers');
      return;
    }

    this.isLoading = true;

    this.cryptoService.decrypt(
      this.decryptInput,
      pStr,
      qStr,
      sStr
    ).pipe(
      finalize(() => {
        setTimeout(() => this.isLoading = false, 100);
      })
    ).subscribe({
      next: (response: EncryptionResult) => {
        this.decryptResult = response.ciphertextHex;
        this.decryptionSteps = response.steps || [];
        this.showResult = true;

        if (this.settingsService.getSetting('autoCopy')) {
          this.copyToClipboard();
        }
      },
      error: (error) => {
        const errorMsg = error.error?.message || error.message || 'Unknown server error';
        this.triggerShake(`Decryption failed: ${errorMsg}`);
        console.error('Decryption error:', error);
      }
    });
  }

  copyToClipboard(): void {
    if (!this.decryptResult) return;
    navigator.clipboard.writeText(this.decryptResult).then(() => {
      console.log('Decrypted text copied!');
    });
  }

  clearForm(): void {
    this.decryptInput = '';
    this.decryptP = '71';
    this.decryptQ = '83';
    this.decryptSeed = '12';
    this.decryptResult = '';
    this.decryptionSteps = [];
    this.showResult = false;
    this.showSteps = false;
    this.errorMessage = '';
    this.isLoading = false;
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }
}
