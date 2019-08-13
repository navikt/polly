CREATE TABLE IF NOT EXISTS POL_DATASETT
(
    POL_DATASETT_ID    BIGSERIAL PRIMARY KEY,
    GITHUB_SHA         VARCHAR(100) NOT NULL,
    CREATED_BY         VARCHAR(200) NOT NULL,
    CREATED_DATE       TIMESTAMP    NOT NULL,
    LAST_MODIFIED_BY   VARCHAR(200),
    LAST_MODIFIED_DATE TIMESTAMP
);