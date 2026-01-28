import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface Card {
  suit: string;
  rank: string;
  symbol: string;
}

interface EncryptionStep {
  n: number;
  xn: string;
  bit: number | string;
}

@Component({
  selector: 'app-card-shuffle',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './card-shuffle.component.html',
  styleUrls: ['./card-shuffle.component.scss']
})
export class CardShuffleComponent implements OnInit {
  p: string | number = '71';
  q: string | number = '83';
  seed: string | number = '12';

  deck: Card[] = [];
  shuffledDeck: Card[] = [];
  drawnHands: Card[][] = [];
  shuffleSteps: EncryptionStep[] = [];

  showShuffledDeck: boolean = false;
  showHands: boolean = false;
  showSteps: boolean = false;
  isShuffling: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  isShaking: boolean = false;

  private suits = ['♠', '♥', '♦', '♣'];
  private ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor(private http: HttpClient) {
    this.initializeDeck();
  }

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
    this.isShuffling = false;
    setTimeout(() => {
      this.isShaking = false;
    }, 500);
  }

  private initializeDeck(): void {
    this.deck = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
        this.deck.push({
          suit,
          rank,
          symbol: `${rank}${suit}`
        });
      }
    }
  }

  shuffleDeck(): void {
    const pStr = String(this.p || '').trim();
    const qStr = String(this.q || '').trim();
    const sStr = String(this.seed || '').trim();

    this.message = '';
    this.shuffleSteps = [];

    if (!pStr || !qStr || !sStr) {
      this.triggerShake('Please enter P, Q, and Seed values');
      return;
    }

    const pVal = Number(pStr);
    const qVal = Number(qStr);

    if (isNaN(pVal) || isNaN(qVal)) {
      this.triggerShake('P and Q must be valid numbers.');
      return;
    }

    if (!this.isPrime(pVal) || !this.isPrime(qVal)) {
      this.triggerShake('Security Risk: Both P and Q must be prime numbers');
      return;
    }

    this.isShuffling = true;
    this.message = 'Shuffling deck...';
    this.messageType = 'info';

    const request = { p: pStr, q: qStr, seed: sStr };

    this.http.post<any>('http://localhost:8080/api/demo/shuffle-deck', request)
      .pipe(
        finalize(() => {
          if (this.messageType === 'error') this.isShuffling = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.shuffledDeck = response.shuffledDeck.map((cardStr: string) => {
              const suit = cardStr.slice(-1);
              const rank = cardStr.slice(0, -1);
              return { suit, rank, symbol: cardStr };
            });
            this.shuffleSteps = response.steps || [];
            this.showShuffledDeck = true;
            this.message = `${response.message}`;
            this.messageType = 'success';
          } else {
            this.triggerShake(`❌ ${response.message || 'Shuffle failed'}`);
          }
          this.isShuffling = false;
        },
        error: (err) => {
          this.isShuffling = false;
          const errorMsg = err.error?.message || err.message || 'Error connecting to server';
          this.triggerShake(`❌ ${errorMsg}`);
        }
      });
  }

  resetDeck(): void {
    this.initializeDeck();
    this.shuffledDeck = [];
    this.shuffleSteps = [];
    this.showShuffledDeck = false;
    this.showSteps = false;
    this.message = '';
    this.isShuffling = false;
  }

  toggleSteps(): void {
    this.showSteps = !this.showSteps;
  }

  changeSeed(): void {
    this.seed = Math.floor(Math.random() * 1000).toString();
    this.message = `Seed changed to ${this.seed}`;
    this.messageType = 'info';
  }

  drawCards(count: number): Card[] {
    if (this.shuffledDeck.length === 0) {
      this.triggerShake('❌ Please shuffle the deck first');
      return [];
    }
    const drawnCards = this.shuffledDeck.splice(0, count);
    this.drawnHands.push([...drawnCards]);
    this.showHands = true;
    this.message = `✅ Drew ${drawnCards.length} card${drawnCards.length > 1 ? 's' : ''}`;
    this.messageType = 'success';
    return drawnCards;
  }

  toggleHands(): void {
    this.showHands = !this.showHands;
  }

  clearHands(): void {
    this.drawnHands = [];
    this.showHands = false;
  }
}
