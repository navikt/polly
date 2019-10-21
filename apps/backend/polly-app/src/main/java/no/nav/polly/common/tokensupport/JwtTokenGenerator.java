package no.nav.polly.common.tokensupport;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import no.nav.polly.github.GithubProperties;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtTokenGenerator {

    public static final int TOKEN_MAX_AGE_MINUTES = 9;

    @Autowired
    private GithubProperties githubProperties;

    public String generateToken() {
        try {
            byte[] keyDataBytes = Files.readAllBytes(Paths.get(githubProperties.getKeyPath()));
            String keyDataString = new String(keyDataBytes, StandardCharsets.UTF_8);
            PrivateKey key = loadPrivateKey(keyDataString);

            Map<String, Object> claims = new HashMap<>();
            Date now = new Date();
            //seconds
            Long iat = now.getTime() / 1000;
            Long exp = iat + TOKEN_MAX_AGE_MINUTES * 60;

            // put your information into claim
            claims.put("iat", iat);
            claims.put("exp", exp);
            claims.put("iss", githubProperties.getAppId());

            return Jwts.builder().setClaims(claims).signWith(key, SignatureAlgorithm.RS256).compact();
        } catch (IOException ex) {
            log.error(String.format("Error occurred when reading key file from %s.", githubProperties.getKeyPath()), ex);
            throw new IllegalArgumentException(String.format("Error occurred when reading key file from %s.", githubProperties.getKeyPath()), ex);
        }
    }

    /**
     * Load private pkcs8 pem file to get the private key
     *
     * @param key String of the Pkcs8 file
     * @return PrivateKey
     */
    public static PrivateKey loadPrivateKey(String key) {
        String privateKeyPEM = key
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        // decode to get the binary DER representation
        byte[] privateKeyDER = Base64.decodeBase64(privateKeyPEM);

        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateKeyDER));
            return privateKey;
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            log.error("Error occurred when generating private key.", e);
            throw new IllegalArgumentException("Error occurred when reading key.", e);
        }
    }
}