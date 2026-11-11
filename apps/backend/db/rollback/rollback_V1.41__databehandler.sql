-- MANUELL tilbakerulling av V1.41__databehandler.sql. Kjøres IKKE av Flyway.
--
-- Rekkefølge ved rollback:
--   1. Stopp/skaler ned backend.
--   2. Kjør dette skriptet mot databasen (én transaksjon).
--   3. Deploy backend og frontend fra commiten før Databehandler-endringene.
--
-- Skriptet bygger PROCESSOR tilbake fra DATABEHANDLER (ikke fra backupen), slik at endringer gjort etter
-- migreringen ikke går tapt. Nøkkeloversettingen er ren omdøping, så den kan reverseres eksakt.
-- Backup-tabellene fra V1.41 (PROCESSOR_BACKUP, AUDIT_VERSION_PROCESSOR_BACKUP) beholdes, men får et
-- tidsstempel-suffiks (f.eks. PROCESSOR_BACKUP_RB_20261110183000), og ryddes manuelt.
-- Skriptet avbryter uten endringer hvis databasen ikke er i forventet tilstand (DATABEHANDLER finnes, PROCESSOR ikke).

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.databehandler_rename_key(j JSONB, old_key TEXT, new_key TEXT) RETURNS JSONB
    LANGUAGE sql IMMUTABLE AS
$$
SELECT CASE
           WHEN jsonb_typeof(j) = 'object' AND (j -> old_key) IS NOT NULL
               THEN (j - old_key) || jsonb_build_object(new_key, j -> old_key)
           ELSE j
           END
$$;

CREATE OR REPLACE FUNCTION pg_temp.databehandler_rename_keys_reverse(j JSONB) RETURNS JSONB
    LANGUAGE sql IMMUTABLE AS
$$
SELECT pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(
       pg_temp.databehandler_rename_key(j,
           'navn', 'name'),
           'avtalereferanse', 'contract'),
           'avtaleeier', 'contractOwner'),
           'fagansvarlig', 'operationalContractManagers'),
           'merknad', 'note'),
           'behandlingUtenforEuEos', 'outsideEU'),
           'overforingsgrunnlagUtenforEuEos', 'transferGroundsOutsideEU'),
           'overforingsgrunnlagUtenforEuEosAnnet', 'transferGroundsOutsideEUOther'),
           'landDataOverforesTil', 'countries')
$$;

DO
$$
    DECLARE
        suffix TEXT := to_char(clock_timestamp(), 'YYYYMMDDHH24MISSUS');
    BEGIN
        IF to_regclass('public.databehandler') IS NULL OR to_regclass('public.processor') IS NOT NULL THEN
            RAISE EXCEPTION 'Rollback V1.41: forventet at DATABEHANDLER finnes og PROCESSOR ikke finnes - avbryter';
        END IF;

        -- Flytt backup-tabellene unna (processor_backup eier bl.a. PK-navnet processor_pkey),
        -- slik at V1.41 kan kjøres på nytt senere uten navnekonflikt.
        IF to_regclass('public.processor_backup') IS NOT NULL THEN
            EXECUTE 'ALTER TABLE processor_backup RENAME CONSTRAINT processor_pkey TO processor_backup_rb_' || suffix || '_pkey';
            EXECUTE 'ALTER TABLE processor_backup RENAME TO processor_backup_rb_' || suffix;
        END IF;
        IF to_regclass('public.audit_version_processor_backup') IS NOT NULL THEN
            EXECUTE 'ALTER TABLE audit_version_processor_backup RENAME TO audit_version_processor_backup_rb_' || suffix;
        END IF;

        -- Gjenopprett PROCESSOR med samme struktur og navn som før V1.41
        ALTER TABLE databehandler RENAME TO processor;
        ALTER TABLE processor RENAME COLUMN id TO processor_id;
        ALTER TABLE processor RENAME CONSTRAINT databehandler_pkey TO processor_pkey;
        UPDATE processor SET data = pg_temp.databehandler_rename_keys_reverse(data);

        -- Audit-historikk tilbake til gammelt tabellnavn og gamle nøkler (inkl. rader skrevet etter migreringen)
        UPDATE audit_version
        SET table_name = 'PROCESSOR',
            data       = CASE
                             WHEN jsonb_typeof(data -> 'data') = 'object'
                                 THEN jsonb_set(data, '{data}', pg_temp.databehandler_rename_keys_reverse(data -> 'data'))
                             ELSE data
                END
        WHERE table_name = 'DATABEHANDLER';

        -- Slik at Flyway kjører V1.41 på nytt ved neste deploy av ny kode
        DELETE FROM flyway_polly_history WHERE version = '1.41';
    END
$$;

DROP FUNCTION pg_temp.databehandler_rename_keys_reverse(JSONB);
DROP FUNCTION pg_temp.databehandler_rename_key(JSONB, TEXT, TEXT);

COMMIT;
