package no.nav.polly.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LdapResult {

    private ResultCode resultCode;
    private String message;

    public boolean erOk() {
        return resultCode != null && resultCode.getIntValue() == 0;
    }
}
