ALTER TABLE PROCESS
    ADD COLUMN DATA JSONB;

UPDATE PROCESS P
SET DATA = jsonb_build_object('legalBases', p.LEGAL_BASES, 'start', p.START_DATE::text, 'end', p.END_DATE::text)
WHERE DATA IS NULL;

ALTER TABLE PROCESS
    ALTER COLUMN DATA SET NOT NULL,
    DROP COLUMN START_DATE,
    DROP COLUMN END_DATE,
    DROP COLUMN LEGAL_BASES;
