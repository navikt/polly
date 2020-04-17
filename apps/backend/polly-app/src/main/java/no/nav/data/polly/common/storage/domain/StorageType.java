package no.nav.data.polly.common.storage.domain;

import lombok.Getter;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.settings.dto.Settings;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum StorageType {

    SETTINGS(Settings.class),
    APP_STATE(AppState.class, false),
    ALERT_EVENT(AlertEvent.class, false);

    private static Map<Class<?>, StorageType> map = new HashMap<>();

    @Getter
    private final Class<? extends GenericStorageData> type;
    @Getter
    private boolean audit;

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
