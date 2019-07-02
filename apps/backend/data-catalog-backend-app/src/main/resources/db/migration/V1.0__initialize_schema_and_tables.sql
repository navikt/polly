CREATE SCHEMA IF NOT EXISTS BACKEND_SCHEMA;

CREATE SEQUENCE IF NOT EXISTS BACKEND_SCHEMA.SEQ_INFORMATION_TYPE;

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.CODELIST
(
    LIST_NAME          VARCHAR(100) NOT NULL,
    CODE               VARCHAR(100) NOT NULL,
    DESCRIPTION        VARCHAR(500) NOT NULL,
    CREATED_BY         VARCHAR(200) NOT NULL,
    CREATED_DATE       TIMESTAMP    NOT NULL,
    LAST_MODIFIED_BY   VARCHAR(200),
    LAST_MODIFIED_DATE TIMESTAMP,
    UNIQUE (LIST_NAME, CODE)
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.INFORMATION_TYPE
(
    INFORMATION_TYPE_ID  INTEGER DEFAULT nextval('BACKEND_SCHEMA.SEQ_INFORMATION_TYPE') PRIMARY KEY,
    NAME                 VARCHAR(100) UNIQUE NOT NULL,
    DESCRIPTION          TEXT                NOT NULL,
    CATEGORY_CODE        TEXT                NOT NULL,
    PRODUCER_CODE        TEXT                NOT NULL,
    SYSTEM_CODE          TEXT                NOT NULL,
    PERSONAL_DATA        BOOLEAN             NOT NULL,
    ELASTICSEARCH_ID     TEXT,
    ELASTICSEARCH_STATUS TEXT                NOT NULL,
    CREATED_BY           VARCHAR(200)        NOT NULL,
    CREATED_DATE         TIMESTAMP           NOT NULL,
    LAST_MODIFIED_BY     VARCHAR(200),
    LAST_MODIFIED_DATE   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DATASET
(
    DATASET_ID           UUID PRIMARY KEY,
    JSON_PROPERTY        JSONB        NOT NULL,
    ELASTICSEARCH_STATUS TEXT         NOT NULL,
    CREATED_BY           VARCHAR(200) NOT NULL,
    CREATED_DATE         TIMESTAMP    NOT NULL,
    LAST_MODIFIED_BY     VARCHAR(200),
    LAST_MODIFIED_DATE   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DISTRIBUTION_CHANNEL
(
    DISTRIBUTION_CHANNEL_ID UUID PRIMARY KEY,
    NAME                    VARCHAR(100) UNIQUE NOT NULL,
    DESCRIPTION             TEXT                NOT NULL,
    PRODUCERS               TEXT                NOT NULL,
    CONSUMERS               TEXT                NOT NULL,
    CREATED_BY              VARCHAR(200)        NOT NULL,
    CREATED_DATE            TIMESTAMP           NOT NULL,
    LAST_MODIFIED_BY        VARCHAR(200),
    LAST_MODIFIED_DATE      TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.SYSTEM
(
    SYSTEM_ID          UUID PRIMARY KEY,
    NAME               VARCHAR(100) UNIQUE NOT NULL,
    CREATED_BY         VARCHAR(200)        NOT NULL,
    CREATED_DATE       TIMESTAMP           NOT NULL,
    LAST_MODIFIED_BY   VARCHAR(200),
    LAST_MODIFIED_DATE TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DATASET__PARENT_OF_DATASET
(
    DATASET_ID           UUID REFERENCES BACKEND_SCHEMA.DATASET,
    PARENT_OF_DATASET_ID UUID REFERENCES BACKEND_SCHEMA.DATASET,
    PRIMARY KEY (DATASET_ID, PARENT_OF_DATASET_ID)
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DATASET__DISTRIBUTION_CHANNEL
(
    DATASET_ID              UUID REFERENCES BACKEND_SCHEMA.DATASET,
    DISTRIBUTION_CHANNEL_ID UUID REFERENCES BACKEND_SCHEMA.DISTRIBUTION_CHANNEL,
    PRIMARY KEY (DATASET_ID, DISTRIBUTION_CHANNEL_ID)
);

CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DISTRIBUTION_CHANNEL__SYSTEM_PRODUCER
(
    DISTRIBUTION_CHANNEL_ID UUID REFERENCES BACKEND_SCHEMA.DISTRIBUTION_CHANNEL,
    SYSTEM_ID               UUID REFERENCES BACKEND_SCHEMA.SYSTEM,
    PRIMARY KEY (DISTRIBUTION_CHANNEL_ID, SYSTEM_ID)
);


CREATE TABLE IF NOT EXISTS BACKEND_SCHEMA.DISTRIBUTION_CHANNEL__SYSTEM_CONSUMER
(
    DISTRIBUTION_CHANNEL_ID UUID REFERENCES BACKEND_SCHEMA.DISTRIBUTION_CHANNEL,
    SYSTEM_ID               UUID REFERENCES BACKEND_SCHEMA.SYSTEM,
    PRIMARY KEY (DISTRIBUTION_CHANNEL_ID, SYSTEM_ID)
);

DROP INDEX IF EXISTS UK_INFORMATION_TYPE;

CREATE UNIQUE INDEX IF NOT EXISTS UK_INFORMATION_TYPE_NAME_UPPER ON BACKEND_SCHEMA.INFORMATION_TYPE (TRIM(UPPER(NAME)));