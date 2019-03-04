package no.nav.data.catalog.backend.app.common.tokensupport;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtTokenGenerator {

    public static String generateToken(String filePath) {
        java.security.Security.addProvider(
                new org.bouncycastle.jce.provider.BouncyCastleProvider());

        PrivateKey privateKey = loadKey(filePath);

        String token = null;
        try {
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

            token = Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.RS256, privateKey).compact();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return token;
    }

    private static PrivateKey loadKey(String filepath) {
        PrivateKey key = null;
        try {
            key = readPrivateKeyFromFile(filepath, "RSA");
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        return key;
    }

    private static byte[] parsePEMFile(File pemFile) throws IOException {
        if (!pemFile.isFile() || !pemFile.exists()) {
            throw new FileNotFoundException(String.format("The file '%s' doesn't exist.", pemFile.getAbsolutePath()));
        }
        PemReader reader = new PemReader(new FileReader(pemFile));
        PemObject pemObject = reader.readPemObject();
        byte[] content = pemObject.getContent();
        reader.close();
        return content;
    }

    private static PrivateKey getPrivateKey(byte[] keyBytes, String algorithm) {
        PrivateKey privateKey = null;
        try {
            KeyFactory kf = KeyFactory.getInstance(algorithm);
            EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
            privateKey = kf.generatePrivate(keySpec);
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Could not reconstruct the private key, the given algorithm could not be found.");
        } catch (InvalidKeySpecException e) {
            System.out.println("Could not reconstruct the private key");
        }
        return privateKey;
    }

    private static PrivateKey readPrivateKeyFromFile(String filepath, String algorithm) throws IOException {
        byte[] bytes = parsePEMFile(new File(filepath));
        return getPrivateKey(bytes, algorithm);
    }
}