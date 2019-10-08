package no.nav.data.catalog.backend.app.kafka.schema.domain;

public enum FieldType {
    BASIC,
    ENUM,
    ARRAY,
    MAP,
    OBJECT,
    UNION;

    public boolean isEnum() {
        return this == FieldType.ENUM;
    }

    public boolean isObject() {
        return this == FieldType.OBJECT;
    }

    public boolean isUnion() {
        return this == FieldType.UNION;
    }
}
