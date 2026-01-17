package mac.crypto.demo.domain;

public class EncryptionStep implements java.io.Serializable {
    private int n;
    private String xn;
    private int bit;

    public EncryptionStep() {
    }

    public EncryptionStep(int n, String xn, int bit) {
        this.n = n;
        this.xn = xn;
        this.bit = bit;
    }

    public int getN() {
        return n;
    }

    public void setN(int n) {
        this.n = n;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public int getBit() {
        return bit;
    }

    public void setBit(int bit) {
        this.bit = bit;
    }
}
