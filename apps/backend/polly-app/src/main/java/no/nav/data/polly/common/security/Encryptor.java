package no.nav.data.polly.common.security;

import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.util.Assert;

public class Encryptor {

    private final String key;
    private StringKeyGenerator saltGenerator = KeyGenerators.string();

    public Encryptor(String key) {
        this.key = key;
    }

    public String encrypt(String text) {
        String salt = saltGenerator.generateKey();
        return salt + Encryptors.text(key, salt).encrypt(text);
    }

    public String decrypt(String encryptedText) {
        Assert.isTrue(encryptedText != null && encryptedText.length() > 16, "invalid encryptionText");
        return Encryptors.text(key, encryptedText.substring(0, 16)).decrypt(encryptedText.substring(16));
    }
}
