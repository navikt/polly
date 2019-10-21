package no.nav.data.polly;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.Charset;

public final class TestUtil {

    private TestUtil() {
    }

    public static String readFile(String path) {
        try {
            return StreamUtils.copyToString(new ClassPathResource(path).getInputStream(), Charset.defaultCharset());
        } catch (IOException e) {
            throw new RuntimeException("error reading file " + path, e);
        }
    }
}
