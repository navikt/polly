CREATE SCHEMA IF NOT EXISTS BACKEND_SCHEMA;

CREATE SEQUENCE BACKEND_SCHEMA.SEQ_INFORMATION_TYPE;

CREATE TABLE BACKEND_SCHEMA.LOOKUP_TABLE
(
  entity      TEXT NOT NULL,
  code        TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (entity, code)
);

CREATE TABLE BACKEND_SCHEMA.INFORMATION_TYPE
(
  information_type_id   INTEGER DEFAULT nextval('BACKEND_SCHEMA.SEQ_INFORMATION_TYPE') PRIMARY KEY,
  information_type_name TEXT UNIQUE NOT NULL,
  description           TEXT        NOT NULL,
  information_category  TEXT        NOT NULL,
  information_producer  TEXT        NOT NULL,
  information_system    TEXT        NOT NULL,
  date_created          TEXT,
  created_by            TEXT,
  date_last_updated     TEXT,
  updated_by            TEXT,
  personal_data         BOOLEAN     NOT NULL,
  json_string           TEXT,
  elasticsearch_id      TEXT        NOT NULL,
  elasticsearch_status  TEXT        NOT NULL
);
