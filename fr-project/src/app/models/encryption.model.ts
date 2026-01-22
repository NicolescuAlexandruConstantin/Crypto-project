/**
 * DTO Models that match the Java backend domain classes
 */

export interface EncryptionStep {
  n: number;
  xn: string;
  bit: number;
}

export interface EncryptionResult {
  ciphertextHex: string;
  steps: EncryptionStep[];
}

export interface EncryptionRequest {
  input?: string;
  encrypted?: string;
  p: string;
  q: string;
  seed: string;
}
