package no.nav.data.polly.common.security;

import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.security.domain.Auth;
import no.nav.data.polly.common.security.domain.AuthRepository;
import no.nav.data.polly.common.utils.StringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final Encryptor encryptor;

    public AuthService(AuthRepository authRepository, Encryptor refreshTokenEncryptor) {
        this.authRepository = authRepository;
        this.encryptor = refreshTokenEncryptor;
    }

    public Auth getAuth(String sessionId, String sessionKey) {
        var sessUuid = StringUtils.toUUID(sessionId);
        return authRepository.findById(sessUuid)
                .orElseThrow(() -> new PollyNotFoundException("couldn't find session"))
                .addSecret(encryptor, sessionKey);
    }

    public String createAuth(String userId, String refreshToken) {
        String saltedCipher = encryptor.encrypt(refreshToken);
        var auth = authRepository.save(Auth.builder()
                .generateId()
                .userId(userId)
                .encryptedRefreshToken(encryptor.getCipher(saltedCipher))
                .initiated(LocalDateTime.now())
                .build())
                .addSecret(encryptor, encryptor.getSalt(saltedCipher));
        return auth.session();
    }

    public void deleteAuth(Auth auth) {
        authRepository.deleteById(auth.getId());
    }
}
