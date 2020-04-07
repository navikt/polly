package no.nav.data.polly.alert.domain;

import lombok.Getter;

import static no.nav.data.polly.alert.domain.AlertEventLevel.ERROR;
import static no.nav.data.polly.alert.domain.AlertEventLevel.INFO;
import static no.nav.data.polly.alert.domain.AlertEventLevel.WARNING;

public enum AlertEventType {

    MISSING_ARTICLE_6(ERROR),
    MISSING_ARTICLE_9(ERROR),

    MISSING_LEGAL_BASIS(WARNING),

    USES_ALL_INFO_TYPE(INFO);

    @Getter
    private final AlertEventLevel level;

    AlertEventType(AlertEventLevel level) {
        this.level = level;
    }
}
