CREATE TABLE IF NOT EXISTS INFORMATION_TYPE
(
    INFORMATION_TYPE_ID UUID         PRIMARY KEY,
    NAME                TEXT         NOT NULL,
    DESCRIPTION         TEXT         NOT NULL,
    CATEGORIES          TEXT         NOT NULL,
    PII                 TEXT         NOT NULL,
    SENSITIVITY         TEXT         NOT NULL,
    CREATED_BY          VARCHAR(200) NOT NULL,
    CREATED_DATE        TIMESTAMP    NOT NULL,
    LAST_MODIFIED_BY    VARCHAR(200),
    LAST_MODIFIED_DATE  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CONTEXT
(
    CONTEXT_ID           UUID         PRIMARY KEY,
    INFORMATION_TYPE_ID  UUID         NOT NULL,
    ELASTICSEARCH_STATUS TEXT         NOT NULL,
    NAME                 TEXT         NOT NULL,
    DESCRIPTION          TEXT         NOT NULL,
    SOURCES              TEXT         NOT NULL,
    KEYWORDS             TEXT         NOT NULL,
    CREATED_BY           VARCHAR(200) NOT NULL,
    CREATED_DATE         TIMESTAMP    NOT NULL,
    LAST_MODIFIED_BY     VARCHAR(200),
    LAST_MODIFIED_DATE   TIMESTAMP
);