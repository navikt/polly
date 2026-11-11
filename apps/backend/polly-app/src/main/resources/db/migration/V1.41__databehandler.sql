-- Databehandler (tidligere Processor) får norske fagtermer.
--
-- * PROCESSOR beholdes uendret, men omdøpes til PROCESSOR_BACKUP.
-- * Ny tabell DATABEHANDLER (PK-kolonne ID) fylles med data fra backup, der JSON-nøklene i DATA er oversatt.
-- * AUDIT_VERSION-rader for Processor tas backup av i AUDIT_VERSION_PROCESSOR_BACKUP, og oversettes deretter
--   (TABLE_NAME 'PROCESSOR' -> 'DATABEHANDLER', samme nøkkeloversetting under DATA.data).
-- * Andre tabeller (f.eks. PROCESS.data.dataProcessing.processors) røres ikke.
--
-- Kun de 9 kjente nøklene endres. Verdiene endres ikke, ukjente nøkler beholdes, og rader der en nøkkel mangler
-- eller DATA ikke er et objekt, blir stående som de er. En nøkkel med verdi null beholdes som null under nytt navn.
--
-- Migreringen er idempotent: den gjør ingenting dersom PROCESSOR ikke finnes eller DATABEHANDLER allerede finnes.
-- Flyway kjører hele skriptet i én transaksjon.
-- Manuell tilbakerulling: se apps/backend/db/rollback/rollback_V1.41__databehandler.sql
-- Backup-tabellene slettes manuelt senere.

CREATE OR REPLACE FUNCTION pg_temp.databehandler_rename_key(j JSONB, old_key TEXT, new_key TEXT) RETURNS JSONB
    LANGUAGE sql IMMUTABLE AS
$$
SELECT CASE
           -- (j -> old_key) er SQL NULL kun når nøkkelen mangler; en JSON null-verdi gir 'null'::jsonb
           WHEN jsonb_typeof(j) = 'object' AND (j -> old_key) IS NOT NULL
               THEN (j - old_key) || jsonb_build_object(new_key, j -> old_key)
           ELSE j
           END
$$;

CREATE OR REPLACE FUNCTION pg_temp.databehandler_rename_keys(j JSONB) RETURNS JSONB
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
           'name', 'navn'),
           'contract', 'avtalereferanse'),
           'contractOwner', 'avtaleeier'),
           'operationalContractManagers', 'fagansvarlig'),
           'note', 'merknad'),
           'outsideEU', 'behandlingUtenforEuEos'),
           'transferGroundsOutsideEU', 'overforingsgrunnlagUtenforEuEos'),
           'transferGroundsOutsideEUOther', 'overforingsgrunnlagUtenforEuEosAnnet'),
           'countries', 'landDataOverforesTil')
$$;

DO
$$
    DECLARE
        unexpected TEXT;
    BEGIN
        IF to_regclass('public.processor') IS NULL OR to_regclass('public.databehandler') IS NOT NULL THEN
            RAISE NOTICE 'V1.41: PROCESSOR finnes ikke eller DATABEHANDLER finnes allerede - ingenting å gjøre';
            RETURN;
        END IF;

        IF to_regclass('public.processor_backup') IS NOT NULL OR to_regclass('public.audit_version_processor_backup') IS NOT NULL THEN
            RAISE EXCEPTION 'V1.41: PROCESSOR_BACKUP/AUDIT_VERSION_PROCESSOR_BACKUP finnes allerede - gi dem nytt navn eller slett dem først';
        END IF;

        -- Sikkerhetsnett: DATABEHANDLER under får kun PK (som PROCESSOR har i dag, jf. V1.34).
        -- Finnes det andre indekser/constraints/fremmednøkler på PROCESSOR, avbrytes migreringen i stedet for å miste dem.
        SELECT string_agg(i.relname::TEXT, ', ') INTO unexpected
        FROM pg_index x
                 JOIN pg_class i ON i.oid = x.indexrelid
        WHERE x.indrelid = 'public.processor'::regclass
          AND NOT x.indisprimary;
        IF unexpected IS NOT NULL THEN
            RAISE EXCEPTION 'V1.41: PROCESSOR har ukjente indekser som må overføres til DATABEHANDLER: %', unexpected;
        END IF;

        SELECT string_agg(conname, ', ') INTO unexpected
        FROM pg_constraint
        WHERE (conrelid = 'public.processor'::regclass AND contype NOT IN ('p', 'n'))
           OR confrelid = 'public.processor'::regclass;
        IF unexpected IS NOT NULL THEN
            RAISE EXCEPTION 'V1.41: PROCESSOR har ukjente constraints som må overføres til DATABEHANDLER: %', unexpected;
        END IF;

        -- a. Behold gammel tabell uendret som backup
        ALTER TABLE processor RENAME TO processor_backup;

        -- b. Ny tabell (tilsvarer PROCESSOR fra V1.34 + VERSION fra V1.40)
        CREATE TABLE databehandler
        (
            id                 UUID      NOT NULL,
            data               JSONB     NOT NULL,
            created_by         TEXT      NOT NULL,
            created_date       TIMESTAMP NOT NULL,
            last_modified_by   TEXT,
            last_modified_date TIMESTAMP,
            version            INTEGER   NOT NULL DEFAULT 0,
            CONSTRAINT databehandler_pkey PRIMARY KEY (id)
        );

        -- c. Kopier data med oversatte JSON-nøkler
        INSERT INTO databehandler (id, data, created_by, created_date, last_modified_by, last_modified_date, version)
        SELECT processor_id,
               pg_temp.databehandler_rename_keys(data),
               created_by,
               created_date,
               last_modified_by,
               last_modified_date,
               version
        FROM processor_backup;

        -- e. Backup av audit-historikken for Processor
        CREATE TABLE audit_version_processor_backup AS
        SELECT *
        FROM audit_version
        WHERE table_name = 'PROCESSOR';

        -- f. Oversett audit-historikken. TABLE_NAME er @Table-navnet til entiteten ('PROCESSOR').
        --    Entiteten serialiseres som {"id": .., "data": {..}, "createdBy": .., ..}, så nøklene ligger under data.data.
        --    Eventuelle nøkler på toppnivå fra eldre format røres ikke.
        UPDATE audit_version
        SET table_name = 'DATABEHANDLER',
            data       = CASE
                             WHEN jsonb_typeof(data -> 'data') = 'object'
                                 THEN jsonb_set(data, '{data}', pg_temp.databehandler_rename_keys(data -> 'data'))
                             ELSE data
                END
        WHERE table_name = 'PROCESSOR';
    END
$$;

DROP FUNCTION pg_temp.databehandler_rename_keys(JSONB);
DROP FUNCTION pg_temp.databehandler_rename_key(JSONB, TEXT, TEXT);
