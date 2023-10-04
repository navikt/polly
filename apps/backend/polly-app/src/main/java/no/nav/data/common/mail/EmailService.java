package no.nav.data.common.mail;

import no.nav.data.common.security.azure.support.MailLog;

import java.util.List;

public interface EmailService {

    void sendMail(MailTask mailTask);

    void scheduleMail(MailTask mailTask);

    List<MailLog> getAllMail();
}
