package no.nav.data.common.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

/**
 * Fallback EmailProvider used when the primary provider (e.g. AzureAdService) is disabled.
 *
 * This is primarily useful for test/local profiles where we still want the application context
 * to start without requiring external email/Azure dependencies.
 */
@Slf4j
@Service
@ConditionalOnMissingBean(EmailProvider.class)
public class NoopEmailProvider implements EmailProvider {

    @Override
    public void sendMail(MailTask mailTask) {
        log.info("NoopEmailProvider - dropping mail to={} subject={}", mailTask.getTo(), mailTask.getSubject());
    }
}
