package mac.crypto.demo.service;

import org.springframework.stereotype.Service;
import mac.crypto.demo.domain.EncryptionResult;
import mac.crypto.demo.domain.EncryptionStep;
import mac.crypto.demo.utils.BlumBlumShubGenerator;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class EncryptionService {

    /**
     * Encrypt a string using Blum Blum Shub generator
     * @param input String to encrypt
     * @param p Prime number p
     * @param q Prime number q
     * @param seed Seed value for the generator
     * @return EncryptionResult containing ciphertext and encryption steps
     */
    public EncryptionResult encrypt(String input, BigInteger p, BigInteger q, BigInteger seed) {
        // Initialize the generator with provided parameters
        BlumBlumShubGenerator generator = new BlumBlumShubGenerator();
        generator.initialize(p, q, seed);

        // Convert string to bytes and encrypt
        byte[] inputBytes = input.getBytes();
        StringBuilder encrypted = new StringBuilder();
        List<EncryptionStep> steps = new ArrayList<>();

        for (int i = 0; i < inputBytes.length; i++) {
            byte b = inputBytes[i];
            BigInteger randomNum = generator.nextRandom(8);
            int encryptedByte = (b ^ randomNum.intValue()) & 0xFF;
            encrypted.append(String.format("%02X", encryptedByte));
            
            // Create encryption step
            EncryptionStep step = new EncryptionStep(
                i + 1,
                randomNum.toString(),
                (encryptedByte & 1)
            );
            steps.add(step);
        }

        return new EncryptionResult(encrypted.toString(), steps);
    }

    /**
     * Decrypt a string using Blum Blum Shub generator
     * @param encrypted Encrypted string in hexadecimal format
     * @param p Prime number p
     * @param q Prime number q
     * @param seed Seed value for the generator
     * @return EncryptionResult containing decrypted text and decryption steps
     */
    public EncryptionResult decrypt(String encrypted, BigInteger p, BigInteger q, BigInteger seed) {
        // Initialize the generator with the same parameters used in encryption
        BlumBlumShubGenerator generator = new BlumBlumShubGenerator();
        generator.initialize(p, q, seed);

        // Convert hex string back to bytes
        StringBuilder decrypted = new StringBuilder();
        List<EncryptionStep> steps = new ArrayList<>();

        for (int i = 0; i < encrypted.length(); i += 2) {
            String hex = encrypted.substring(i, i + 2);
            int encryptedByte = Integer.parseInt(hex, 16);
            BigInteger randomNum = generator.nextRandom(8);
            int decryptedByte = (encryptedByte ^ randomNum.intValue()) & 0xFF;
            decrypted.append((char) decryptedByte);
            
            // Create decryption step
            EncryptionStep step = new EncryptionStep(
                i / 2 + 1,
                randomNum.toString(),
                (decryptedByte & 1)
            );
            steps.add(step);
        }

        return new EncryptionResult(decrypted.toString(), steps);
    }
}
