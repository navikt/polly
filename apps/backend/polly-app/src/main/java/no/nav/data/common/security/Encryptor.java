package no.nav.data.common.security;

import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.util.Assert;

public class Encryptor {

    private final String key;
    private final StringKeyGenerator saltGenerator = KeyGenerators.string();
    private final int saltLength = saltGenerator.generateKey().length();

    public Encryptor(String key) {
        this.key = key;
    }

    public String encrypt(String text) {
        String salt = saltGenerator.generateKey();
        return salt + Encryptors.text(key, salt).encrypt(text);
    }

    public String decrypt(String encryptedText) {
        Assert.isTrue(encryptedText != null && encryptedText.length() > saltLength, "invalid encryptionText");
        return Encryptors.text(key, getSalt(encryptedText)).decrypt(getCipher(encryptedText));
    }

    public String getSalt(String encryptedText) {
        return encryptedText.substring(0, saltLength);
    }

    String getCipher(String encryptedText) {
        return encryptedText.substring(saltLength);
    }
}
