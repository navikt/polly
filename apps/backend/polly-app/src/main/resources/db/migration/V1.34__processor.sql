CREATE TABLE IF NOT EXISTS PROCESSOR
(
    PROCESSOR_ID      UUID PRIMARY KEY,
    DATA               JSONB     NOT NULL,
    CREATED_BY         TEXT      NOT NULL,
    CREATED_DATE       TIMESTAMP NOT NULL,
    LAST_MODIFIED_BY   TEXT,
    LAST_MODIFIED_DATE TIMESTAMP
);