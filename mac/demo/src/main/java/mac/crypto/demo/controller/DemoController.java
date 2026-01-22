package mac.crypto.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import mac.crypto.demo.domain.EncryptionResult;
import mac.crypto.demo.domain.EncryptionRequest;
import mac.crypto.demo.service.EncryptionService;
import java.util.HashMap;
import java.util.Map;
import java.math.BigInteger;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    @Autowired
    private EncryptionService encryptionService;

    @PostMapping("/encrypt")
    public EncryptionResult encrypt(@RequestBody EncryptionRequest request) {
        BigInteger p = new BigInteger(request.getP());
        BigInteger q = new BigInteger(request.getQ());
        BigInteger seed = new BigInteger(request.getSeed());
        return encryptionService.encrypt(request.getInput(), p, q, seed);
    }

    @PostMapping("/decrypt")
    public EncryptionResult decrypt(@RequestBody EncryptionRequest request) {
        BigInteger p = new BigInteger(request.getP());
        BigInteger q = new BigInteger(request.getQ());
        BigInteger seed = new BigInteger(request.getSeed());
        return encryptionService.decrypt(request.getEncrypted(), p, q, seed);
    }

    @PostMapping("/roulette")
    public Map<String, Object> spinRoulette(@RequestBody Map<String, Object> request) {
        BigInteger p = new BigInteger(request.get("p").toString());
        BigInteger q = new BigInteger(request.get("q").toString());
        BigInteger seed = new BigInteger(request.get("seed").toString());
        Integer slots = ((Number) request.get("slots")).intValue();

        // Generate random number for roulette using Blum Blum Shub
        int result = encryptionService.generateRouletteSpin(p, q, seed, slots);
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("winningNumber", result);
        response.put("success", true);
        
        return response;
    }
}
