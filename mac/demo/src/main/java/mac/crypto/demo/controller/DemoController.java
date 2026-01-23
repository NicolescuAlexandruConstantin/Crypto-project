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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    private static final Logger logger = LoggerFactory.getLogger(DemoController.class);

    @Autowired
    private EncryptionService encryptionService;

    @PostMapping("/encrypt")
    public EncryptionResult encrypt(@RequestBody EncryptionRequest request) {
        logger.info("Received encrypt request with p: {}, q: {}, seed: {}", request.getP(), request.getQ(), request.getSeed());
        BigInteger p = new BigInteger(request.getP());
        BigInteger q = new BigInteger(request.getQ());
        BigInteger seed = new BigInteger(request.getSeed());
        EncryptionResult result = encryptionService.encrypt(request.getInput(), p, q, seed);
        logger.info("Encrypt request completed successfully");
        return result;
    }

    @PostMapping("/decrypt")
    public EncryptionResult decrypt(@RequestBody EncryptionRequest request) {
        logger.info("Received decrypt request with p: {}, q: {}, seed: {}", request.getP(), request.getQ(), request.getSeed());
        BigInteger p = new BigInteger(request.getP());
        BigInteger q = new BigInteger(request.getQ());
        BigInteger seed = new BigInteger(request.getSeed());
        EncryptionResult result = encryptionService.decrypt(request.getEncrypted(), p, q, seed);
        logger.info("Decrypt request completed successfully");
        return result;
    }

    @PostMapping("/roulette")
    public Map<String, Object> spinRoulette(@RequestBody Map<String, Object> request) {
        logger.info("Received roulette request with p: {}, q: {}, slots: {}", request.get("p"), request.get("q"), request.get("slots"));
        BigInteger p = new BigInteger(request.get("p").toString());
        BigInteger q = new BigInteger(request.get("q").toString());
        BigInteger seed = new BigInteger(request.get("seed").toString());
        Integer slots = ((Number) request.get("slots")).intValue();

        // Generate random number for roulette using Blum Blum Shub
        EncryptionResult result = encryptionService.generateRouletteSpin(p, q, seed, slots);
        int winningNumber = Integer.parseInt(result.getCiphertextHex());
        logger.info("Roulette spin result: {}", winningNumber);
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", winningNumber);
        response.put("winningNumber", winningNumber);
        response.put("success", true);
        response.put("steps", result.getSteps());
        
        return response;
    }
}
