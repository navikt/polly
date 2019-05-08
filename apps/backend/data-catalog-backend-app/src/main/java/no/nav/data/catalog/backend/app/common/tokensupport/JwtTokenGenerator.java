package no.nav.data.catalog.backend.app.common.tokensupport;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenGenerator.class);

    @Value("${github.keyPath}")
    private String keypath;

    public String generateToken() {
        try {
            byte[] keyDataBytes = Files.readAllBytes(Paths.get(keypath));
            String keyDataString = new String(keyDataBytes, StandardCharsets.UTF_8);
            PrivateKey key = loadPrivateKey(keyDataString);

            Map<String, Object> claims = new HashMap<String, Object>();
            Date now = new Date();
            //seconds
            Long iat = now.getTime() / 1000;
            //9 nminutes ttl
            Long exp = iat + 9*60;

            // put your information into claim
            claims.put("iat", iat);
            claims.put("exp", exp);
            claims.put("iss", "26100");

            return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.RS256, key).compact();
        } catch (IOException ex) {
            logger.error(String.format("Error occurred when reading key file from %s.", keypath), ex);
            throw new IllegalArgumentException(String.format("Error occurred when reading key file from %s.", keypath), ex);
        }
    }

    /**
     * Load private pkcs8 pem file to get the private key
     *
     * @param key String of the Pkcs8 file
     * @return PrivateKey
     * @throws Exception
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
        } catch (NoSuchAlgorithmException |InvalidKeySpecException e) {
            logger.error("Error occurred when generating private key.", e);
            throw new IllegalArgumentException("Error occurred when reading key.", e);
        }
    }
}