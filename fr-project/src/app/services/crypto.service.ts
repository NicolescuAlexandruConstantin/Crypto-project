import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() {}

  /**
   * Encrypts text using a simple Caesar Cipher
   * Note: This is for demo purposes. Use proper crypto libraries in production.
   */
  encrypt(text: string, key: string): string {
    if (!text || !key) {
      throw new Error('Text and key are required');
    }

    const shift = this.keyToShift(key);
    return this.caesarEncrypt(text, shift);
  }

  /**
   * Decrypts text using Caesar Cipher
   */
  decrypt(text: string, key: string): string {
    if (!text || !key) {
      throw new Error('Text and key are required');
    }

    const shift = this.keyToShift(key);
    return this.caesarDecrypt(text, shift);
  }

  /**
   * Converts a key string to a shift value
   */
  private keyToShift(key: string): number {
    return key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 26;
  }

  /**
   * Caesar cipher encryption
   */
  private caesarEncrypt(text: string, shift: number): string {
    return text
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join('');
  }

  /**
   * Caesar cipher decryption
   */
  private caesarDecrypt(text: string, shift: number): string {
    return this.caesarEncrypt(text, 26 - shift);
  }
}
