package mac.crypto.demo.domain;

import java.util.List;

public class EncryptionResult implements java.io.Serializable {
    private String ciphertextHex;
    private List<EncryptionStep> steps;

    public EncryptionResult() {
    }

    public EncryptionResult(String ciphertextHex, List<EncryptionStep> steps) {
        this.ciphertextHex = ciphertextHex;
        this.steps = steps;
    }

    public String getCiphertextHex() {
        return ciphertextHex;
    }

    public void setCiphertextHex(String ciphertextHex) {
        this.ciphertextHex = ciphertextHex;
    }

    public List<EncryptionStep> getSteps() {
        return steps;
    }

    public void setSteps(List<EncryptionStep> steps) {
        this.steps = steps;
    }
}
