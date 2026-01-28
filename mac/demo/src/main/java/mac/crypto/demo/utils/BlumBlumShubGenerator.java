package mac.crypto.demo.utils;

import java.math.BigInteger;

public class BlumBlumShubGenerator {

    private BigInteger m;
    private BigInteger current;

    /**
     * Initialize the Blum Blum Shub generator with two prime numbers
     * @param p First prime number (p ≡ 3 mod 4)
     * @param q Second prime number (q ≡ 3 mod 4)
     * @param seed Initial seed value
     */
    public void initialize(BigInteger p, BigInteger q, BigInteger seed) {
        this.m = p.multiply(q);
        this.current = seed.multiply(seed).mod(m);
    }

    /**
     * Generate the next random bit
     * @return Next random bit (0 or 1)
     */
    public int nextBit() {
        current = current.multiply(current).mod(m);
        return current.mod(BigInteger.TWO).intValue();
    }

    /**
     * Generate next random number with specified bit length
     * @param bitLength Number of bits for the random number
     * @return Random BigInteger
     */
    public BigInteger nextRandom(int bitLength) {
        BigInteger result = BigInteger.ZERO;
        for (int i = 0; i < bitLength; i++) {
            result = result.shiftLeft(1).add(BigInteger.valueOf(nextBit()));
        }
        return result;
    }

}
