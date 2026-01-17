package mac.crypto.demo.domain;

import java.math.BigInteger;

public class EncryptionRequest {
    private String input;
    private String encrypted;
    private BigInteger p;
    private BigInteger q;
    private BigInteger seed;

    public EncryptionRequest() {
    }

    public EncryptionRequest(String input, String encrypted, BigInteger p, BigInteger q, BigInteger seed) {
        this.input = input;
        this.encrypted = encrypted;
        this.p = p;
        this.q = q;
        this.seed = seed;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getEncrypted() {
        return encrypted;
    }

    public void setEncrypted(String encrypted) {
        this.encrypted = encrypted;
    }

    public BigInteger getP() {
        return p;
    }

    public void setP(BigInteger p) {
        this.p = p;
    }

    public BigInteger getQ() {
        return q;
    }

    public void setQ(BigInteger q) {
        this.q = q;
    }

    public BigInteger getSeed() {
        return seed;
    }

    public void setSeed(BigInteger seed) {
        this.seed = seed;
    }
}
