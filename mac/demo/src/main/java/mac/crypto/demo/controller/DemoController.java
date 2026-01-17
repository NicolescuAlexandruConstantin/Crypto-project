package mac.crypto.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import mac.crypto.demo.domain.EncryptionResult;
import mac.crypto.demo.domain.EncryptionRequest;
import mac.crypto.demo.service.EncryptionService;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    @Autowired
    private EncryptionService encryptionService;

    @PostMapping("/encrypt")
    public EncryptionResult encrypt(@RequestBody EncryptionRequest request) {
        return encryptionService.encrypt(request.getInput(), 
                                         request.getP(), 
                                         request.getQ(), 
                                         request.getSeed());
    }

    @PostMapping("/decrypt")
    public EncryptionResult decrypt(@RequestBody EncryptionRequest request) {
        return encryptionService.decrypt(request.getEncrypted(), 
                                         request.getP(), 
                                         request.getQ(), 
                                         request.getSeed());
    }
}
