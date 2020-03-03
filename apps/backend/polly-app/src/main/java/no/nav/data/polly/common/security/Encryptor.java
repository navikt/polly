package no.nav.data.polly.common.security;

import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.util.Assert;

public class Encryptor {

    private static final int SALT_LENGTH = 16;

    private final String key;
    private final StringKeyGenerator saltGenerator = KeyGenerators.string();

    public Encryptor(String key) {
        this.key = key;
    }

    public String encrypt(String text) {
        String salt = saltGenerator.generateKey();
        return salt + Encryptors.text(key, salt).encrypt(text);
    }

    public String decrypt(String encryptedText) {
        Assert.isTrue(encryptedText != null && encryptedText.length() > SALT_LENGTH, "invalid encryptionText");
        return Encryptors.text(key, getSalt(encryptedText)).decrypt(getCipher(encryptedText));
    }

    public String getSalt(String encryptedText) {
        return encryptedText.substring(0, SALT_LENGTH);
    }

    String getCipher(String encryptedText) {
        return encryptedText.substring(SALT_LENGTH);
    }
}
