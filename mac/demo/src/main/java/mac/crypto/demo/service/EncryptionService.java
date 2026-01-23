package mac.crypto.demo.service;

import org.springframework.stereotype.Service;
import mac.crypto.demo.domain.EncryptionResult;
import mac.crypto.demo.domain.EncryptionStep;
import mac.crypto.demo.utils.BlumBlumShubGenerator;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /**
     * Generate a random number for roulette using Blum Blum Shub
     * @param p Prime number p
     * @param q Prime number q
     * @param seed Seed value for the generator
     * @param slots Number of slots in the roulette
     * @return EncryptionResult containing the random result and BBS steps
     */
    public EncryptionResult generateRouletteSpin(BigInteger p, BigInteger q, BigInteger seed, int slots) {
        BlumBlumShubGenerator generator = new BlumBlumShubGenerator();
        generator.initialize(p, q, seed);
        
        // Generate random bits until we get a number in valid range
        int bitsNeeded = (int) Math.ceil(Math.log(slots) / Math.log(2));
        List<EncryptionStep> steps = new ArrayList<>();
        BigInteger randomNum = null;
        int result = 0;
        
        // Generate bits and track steps
        for (int i = 0; i < bitsNeeded; i++) {
            randomNum = generator.nextRandom(1);
            int bit = randomNum.intValue();
            
            EncryptionStep step = new EncryptionStep(
                i + 1,
                randomNum.toString(),
                bit
            );
            steps.add(step);
        }
        
        // Generate the final random number
        randomNum = generator.nextRandom(bitsNeeded);
        result = randomNum.intValue() % slots;
        
        // Create result with ciphertext as the winning number
        return new EncryptionResult(String.valueOf(result), steps);
    }

    /**
     * Shuffle a poker deck using Blum Blum Shub generator with Fisher-Yates algorithm
     * @param p Prime number p
     * @param q Prime number q
     * @param seed Seed value for the generator
     * @return Map containing shuffled deck and shuffle steps
     */
    public Map<String, Object> shufflePokerDeck(BigInteger p, BigInteger q, BigInteger seed) {
        BlumBlumShubGenerator generator = new BlumBlumShubGenerator();
        generator.initialize(p, q, seed);
        
        // Create deck: 52 cards (13 ranks × 4 suits)
        String[] suits = {"♠", "♥", "♦", "♣"};
        String[] ranks = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
        
        List<String> deck = new ArrayList<>();
        for (String suit : suits) {
            for (String rank : ranks) {
                deck.add(rank + suit);
            }
        }
        
        // Fisher-Yates shuffle using BBS random numbers
        List<EncryptionStep> steps = new ArrayList<>();
        int stepNum = 0;
        
        for (int i = deck.size() - 1; i > 0; i--) {
            // Generate random index between 0 and i
            int bitsNeeded = (int) Math.ceil(Math.log(i + 1) / Math.log(2));
            BigInteger randomNum = generator.nextRandom(bitsNeeded);
            int randomIndex = randomNum.intValue() % (i + 1);
            
            // Record the shuffle step
            EncryptionStep step = new EncryptionStep(
                stepNum + 1,
                randomNum.toString(),
                randomIndex
            );
            steps.add(step);
            stepNum++;
            
            // Swap cards
            String temp = deck.get(i);
            deck.set(i, deck.get(randomIndex));
            deck.set(randomIndex, temp);
        }
        
        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("shuffledDeck", deck);
        response.put("cardCount", deck.size());
        response.put("steps", steps);
        response.put("message", "Deck shuffled successfully with " + steps.size() + " random swaps");
        
        return response;
    }
}
