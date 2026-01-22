package mac.crypto.demo.domain;

public class EncryptionRequest {
    private String input;
    private String encrypted;
    private String p;
    private String q;
    private String seed;

    public EncryptionRequest() {
    }

    public EncryptionRequest(String input, String encrypted, String p, String q, String seed) {
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

    public String getP() {
        return p;
    }

    public void setP(String p) {
        this.p = p;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public String getSeed() {
        return seed;
    }

    public void setSeed(String seed) {
        this.seed = seed;
    }
}
