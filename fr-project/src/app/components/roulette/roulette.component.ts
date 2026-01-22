import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface RouletteState {
  isSpinning: boolean;
  currentNumber: number;
  result: number | null;
  balance: number;
  bet: number;
  selectedNumber: number | null;
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
    selectedNumber: null
  };

  p = '61';
  q = '53';
  seed = '12';
  
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize with demo values
  }

  spinRoulette(): void {
    if (this.state.bet <= 0 || this.state.bet > this.state.balance) {
      this.message = 'Invalid bet amount!';
      this.messageType = 'error';
      return;
    }

    if (this.state.selectedNumber === null) {
      this.message = 'Please select a number first!';
      this.messageType = 'error';
      return;
    }

    this.state.isSpinning = true;
    this.message = 'Spinning...';
    this.messageType = 'info';

    const request = {
      p: this.p,
      q: this.q,
      seed: this.seed,
      slots: this.slots
    };

    this.http.post<any>('http://localhost:8080/api/demo/roulette', request)
      .subscribe({
        next: (response) => {
          this.animateSpin(response.winningNumber);
        },
        error: () => {
          this.state.isSpinning = false;
          this.message = 'Error connecting to server';
          this.messageType = 'error';
        }
      });
  }

  private animateSpin(winningNumber: number): void {
    let rotations = 0;
    const maxRotations = this.slots * 3 + winningNumber;
    const interval = setInterval(() => {
      this.state.currentNumber = rotations % this.slots;
      rotations++;

      if (rotations > maxRotations) {
        clearInterval(interval);
        this.state.result = winningNumber;
        this.state.isSpinning = false;
        this.evaluateResult(winningNumber);
      }
    }, 50);
  }

  private evaluateResult(winningNumber: number): void {
    // Check if selected number matches winning number
    const isWin = this.state.selectedNumber === winningNumber;
    
    if (isWin) {
      const winnings = this.state.bet * 36;
      this.state.balance += winnings;
      this.message = `🎉 JACKPOT! You selected ${this.state.selectedNumber} and won $${winnings}!`;
      this.messageType = 'success';
    } else {
      this.state.balance -= this.state.bet;
      this.message = `😔 You selected ${this.state.selectedNumber} but got ${winningNumber}. Lost $${this.state.bet}`;
      this.messageType = 'error';
    }
  }

  resetGame(): void {
    this.state.balance = 1000;
    this.state.result = null;
    this.state.currentNumber = 0;
    this.state.selectedNumber = null;
    this.message = '';
  }

  selectNumber(number: number): void {
    this.state.selectedNumber = number;
    this.message = `You selected number ${number}`;
    this.messageType = 'info';
  }

  changeSeed(): void {
    this.seed = Math.floor(Math.random() * 1000).toString();
    this.message = `Seed changed to ${this.seed}`;
    this.messageType = 'info';
  }

  getNumbers(): number[] {
    return Array.from({ length: this.slots }, (_, i) => i);
  }
}
