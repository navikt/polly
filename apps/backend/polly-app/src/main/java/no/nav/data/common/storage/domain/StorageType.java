package no.nav.data.common.storage.domain;

import lombok.Getter;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.security.azure.support.MailLog;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.settings.dto.Settings;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum StorageType {

    SETTINGS(Settings.class),
    APP_STATE(AppState.class, false),
    ALERT_EVENT(AlertEvent.class, false),
    MAIL_LOG(MailLog.class, false),
    MAIL_TASK(MailTask.class, false);

    private static final Map<Class<? extends GenericStorageData>, StorageType> map = new HashMap<>();

    @Getter
    private final Class<? extends GenericStorageData> type;
    @Getter
    private final boolean audit;

    static {
        EnumSet.allOf(StorageType.class).forEach(e -> map.put(e.getType(), e));
    }

    StorageType(Class<? extends GenericStorageData> type) {
        this(type, true);
    }

    StorageType(Class<? extends GenericStorageData> type, boolean audit) {
        this.audit = audit;
        this.type = type;
    }

    public static StorageType fromClass(Class<? extends GenericStorageData> type) {
        return map.get(type);
    }
}
