import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncryptionResult, EncryptionRequest } from '../models/encryption.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://localhost:8080/api/demo';

  constructor(private http: HttpClient) {}

  encrypt(text: string, p: string, q: string, seed: string): Observable<EncryptionResult> {
    if (!text || !p || !q || !seed) {
      throw new Error('Text, P, Q, and Seed are required');
    }

    const request: EncryptionRequest = {
      input: text,
      p: p,
      q: q,
      seed: seed
    };

    return this.http.post<EncryptionResult>(`${this.apiUrl}/encrypt`, request);
  }

  decrypt(encrypted: string, p: string, q: string, seed: string): Observable<EncryptionResult> {
    if (!encrypted || !p || !q || !seed) {
      throw new Error('Encrypted text, P, Q, and Seed are required');
    }

    const request: EncryptionRequest = {
      encrypted: encrypted,
      p: p,
      q: q,
      seed: seed
    };

    return this.http.post<EncryptionResult>(`${this.apiUrl}/decrypt`, request);
  }
}
