ALTER TABLE AUDIT_VERSION
    ADD COLUMN USER_ID TEXT;

UPDATE AUDIT_VERSION
SET USER_ID = 'n/a'
WHERE USER_ID IS NULL;

ALTER TABLE AUDIT_VERSION
    ALTER COLUMN USER_ID SET NOT NULL;