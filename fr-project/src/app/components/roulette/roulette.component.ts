import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { EncryptionStep } from '../../models/encryption.model';

interface RouletteState {
  isSpinning: boolean;
  currentNumber: number;
  result: number | null;
  balance: number;
  bet: number;
  selectedNumber: number | null;
  wheelRotation: number;
}

@Component({
  selector: 'app-roulette',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.scss']
})
export class RouletteComponent implements OnInit {
  slots = 20;
  state: RouletteState = {
    isSpinning: false,
    currentNumber: 0,
    result: null,
    balance: 1000,
    bet: 10,
    selectedNumber: null,
    wheelRotation: 0
  };

  p: string | number = '71';
  q: string | number = '83';
  seed: string | number = '12';

  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  rouletteSteps: EncryptionStep[] = [];
  showSteps: boolean = false;
  isShaking: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

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
    this.message = msg;
    this.messageType = 'error';
    this.isShaking = true;
    this.state.isSpinning = false;
    setTimeout(() => this.isShaking = false, 500);
  }

  spinRoulette(): void {
    this.message = '';
    this.state.result = null;

    const pStr = String(this.p || '').trim();
    const qStr = String(this.q || '').trim();
    const sStr = String(this.seed || '').trim();

    if (this.state.bet <= 0 || this.state.bet > this.state.balance) {
      this.triggerShake('Invalid bet amount!');
      return;
    }

    if (this.state.selectedNumber === null) {
      this.triggerShake('Please select a number first!');
      return;
    }

    if (!pStr || !qStr || !sStr) {
      this.triggerShake('Please fill in all BBS parameters.');
      return;
    }

    const pVal = Number(pStr);
    const qVal = Number(qStr);

    if (isNaN(pVal) || isNaN(qVal)) {
      this.triggerShake('P and Q must be valid numbers.');
      return;
    }

    if (!this.isPrime(pVal) || !this.isPrime(qVal)) {
      this.triggerShake('Security Risk: P and Q must be prime!');
      return;
    }

    this.state.isSpinning = true;
    this.message = 'Spinning...';
    this.messageType = 'info';

    const request = { p: pStr, q: qStr, seed: sStr, slots: this.slots };

    this.http.post<any>('http://localhost:8080/api/demo/roulette', request)
      .pipe(
        finalize(() => {
          if (this.messageType === 'error') this.state.isSpinning = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.rouletteSteps = response.steps || [];
          this.animateSpin(response.winningNumber);
        },
        error: (err) => {
          this.state.isSpinning = false;
          const errorMsg = err.error?.message || err.message || 'Server Unreachable';
          this.triggerShake(`${errorMsg}`);
        }
      });
  }

  private animateSpin(winningNumber: number): void {
    let stepCount = 0;
    const degreePerSlot = 360 / this.slots;
    const totalSteps = (this.slots * 3) + winningNumber;

    const interval = setInterval(() => {
      this.state.wheelRotation -= degreePerSlot;
      this.state.currentNumber = stepCount % this.slots;
      stepCount++;

      if (stepCount > totalSteps) {
        clearInterval(interval);

        this.state.currentNumber = winningNumber;
        const currentFullRotations = Math.floor(Math.abs(this.state.wheelRotation) / 360);
        this.state.wheelRotation = -( (winningNumber * degreePerSlot) + (degreePerSlot / 2) + (currentFullRotations * 360) );

        this.state.result = winningNumber;
        this.state.isSpinning = false;
        this.evaluateResult(winningNumber);
      }
    }, 50);
  }

  private evaluateResult(winningNumber: number): void {
    const isWin = this.state.selectedNumber === winningNumber;
    if (isWin) {
      const winnings = this.state.bet * 36;
      this.state.balance += winnings;
      this.message = `JACKPOT! It's ${winningNumber}! You won $${winnings}!`;
      this.messageType = 'success';
    } else {
      this.state.balance -= this.state.bet;
      this.message = `Result: ${winningNumber}. Lost $${this.state.bet}`;
      this.messageType = 'error';
    }
  }

  resetGame(): void {
    this.state.balance = 1000;
    this.state.result = null;
    this.state.currentNumber = 0;
    this.state.wheelRotation = 0;
    this.state.selectedNumber = null;
    this.message = '';
    this.rouletteSteps = [];
    this.showSteps = false;
  }

  selectNumber(num: number): void {
    if (this.state.isSpinning) return;
    this.state.selectedNumber = num;
  }

  changeSeed(): void {
    this.seed = Math.floor(Math.random() * 10000).toString();
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }

  getNumbers(): number[] {
    return Array.from({ length: this.slots }, (_, i) => i);
  }
}
