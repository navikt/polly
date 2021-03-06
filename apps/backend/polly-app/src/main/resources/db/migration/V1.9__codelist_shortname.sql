ALTER TABLE CODELIST
    ADD COLUMN SHORT_NAME TEXT;

UPDATE CODELIST
SET SHORT_NAME = CODE,
    CODE       = NORMALIZED_CODE
WHERE SHORT_NAME IS NULL;

ALTER TABLE CODELIST
    ALTER COLUMN SHORT_NAME SET NOT NULL,
    DROP COLUMN NORMALIZED_CODE;