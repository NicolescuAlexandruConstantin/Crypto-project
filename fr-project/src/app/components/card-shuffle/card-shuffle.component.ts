import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Card {
  suit: string;
  rank: string;
  symbol: string;
}

@Component({
  selector: 'app-card-shuffle',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './card-shuffle.component.html',
  styleUrls: ['./card-shuffle.component.scss']
})
export class CardShuffleComponent implements OnInit {
  p = '61';
  q = '53';
  seed = '12';

  deck: Card[] = [];
  shuffledDeck: Card[] = [];
  drawnHands: Card[][] = [];
  showShuffledDeck: boolean = false;
  showHands: boolean = false;
  isShuffling: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  private suits = ['♠', '♥', '♦', '♣'];
  private ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor(private http: HttpClient) {
    this.initializeDeck();
  }

  ngOnInit(): void {
    // Initialize component
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
    if (!this.p.trim() || !this.q.trim() || !this.seed.trim()) {
      this.message = '❌ Please enter P, Q, and Seed values';
      this.messageType = 'error';
      return;
    }

    this.isShuffling = true;
    this.message = '🔄 Shuffling deck...';
    this.messageType = 'info';

    // Send shuffle request to backend
    const request = {
      p: this.p,
      q: this.q,
      seed: this.seed
    };

    this.http.post<any>('http://localhost:8080/api/demo/shuffle-deck', request)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Convert card strings to Card objects
            this.shuffledDeck = response.shuffledDeck.map((cardStr: string) => {
              const suit = cardStr.slice(-1);
              const rank = cardStr.slice(0, -1);
              return {
                suit,
                rank,
                symbol: cardStr
              };
            });
            this.showShuffledDeck = true;
            this.message = `✅ ${response.message}`;
            this.messageType = 'success';
          }
          this.isShuffling = false;
        },
        error: () => {
          this.isShuffling = false;
          this.message = '❌ Error shuffling deck';
          this.messageType = 'error';
        }
      });
  }

  resetDeck(): void {
    this.initializeDeck();
    this.shuffledDeck = [];
    this.showShuffledDeck = false;
    this.message = '';
  }

  changeSeed(): void {
    this.seed = Math.floor(Math.random() * 1000).toString();
    this.message = `Seed changed to ${this.seed}`;
    this.messageType = 'info';
  }

  drawCards(count: number): Card[] {
    if (this.shuffledDeck.length === 0) {
      this.message = '❌ Please shuffle the deck first';
      this.messageType = 'error';
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
