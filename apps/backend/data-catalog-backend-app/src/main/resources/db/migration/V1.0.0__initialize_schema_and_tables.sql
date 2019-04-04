DROP SCHEMA IF EXISTS Backend_SCHEMA;
CREATE SCHEMA BACKEND_SCHEMA;
-- CREATE SCHEMA POLICY_SCHEMA;

DROP TABLE IF EXISTS BACKEND_SCHEMA.INFORMATION_PRODUCER;
CREATE TABLE BACKEND_SCHEMA.INFORMATION_PRODUCER
(
  information_producer_id     SERIAL PRIMARY KEY,
  information_producer_code   TEXT NOT NULL,
  information_producer_decode TEXT
);

DROP TABLE IF EXISTS BACKEND_SCHEMA.INFORMATION_CATEGORY;
CREATE TABLE BACKEND_SCHEMA.INFORMATION_CATEGORY
(
  information_category_id     SERIAL PRIMARY KEY,
  information_category_code   TEXT NOT NULL,
  information_category_decode TEXT NOT NULL
);

DROP TABLE IF EXISTS BACKEND_SCHEMA.INFORMATION_SYSTEM;
CREATE TABLE BACKEND_SCHEMA.INFORMATION_SYSTEM
(
  information_system_id     SERIAL PRIMARY KEY,
  information_system_code   TEXT NOT NULL,
  information_system_decode TEXT NOT NULL
);


DROP TABLE IF EXISTS BACKEND_SCHEMA.INFORMATIONTYPE;
CREATE TABLE BACKEND_SCHEMA.INFORMATIONTYPE
(
  informationtype_id       SERIAL PRIMARY KEY,
  informationtype_name     TEXT    NOT NULL,
  information_producer_id  INTEGER NOT NULL,
  information_category_id  INTEGER NOT NULL,
  information_system_id    INTEGER NOT NULL,
  description              TEXT    NOT NULL,
  date_created             DATE    NOT NULL,
  created_by               TEXT    NOT NULL,
  date_last_updated        DATE,
  updated_by               TEXT,
  synched_to_elasticsearch BOOLEAN NOT NULL,
  information_blob         TEXT,
  CONSTRAINT FK_INFORMATION_PRODUCER FOREIGN KEY (information_producer_id) REFERENCES BACKEND_SCHEMA.INFORMATION_PRODUCER (information_producer_id),
  CONSTRAINT FK_INFORMATION_CATEGORY FOREIGN KEY (information_category_id) REFERENCES BACKEND_SCHEMA.INFORMATION_CATEGORY (information_category_id),
  CONSTRAINT FK_INFORMATION_SYSTEM FOREIGN KEY (information_system_id) REFERENCES BACKEND_SCHEMA.INFORMATION_SYSTEM (information_system_id)
);

DROP TABLE IF EXISTS BACKEND_SCHEMA.PERSONAL_DATA_REQUIREMENT;
CREATE TABLE BACKEND_SCHEMA.PERSONAL_DATA_REQUIREMENT
(
  personal_data_requirement_id SERIAL PRIMARY KEY,
--   purpose_id                   INTEGER NOT NULL,
--   policy_id                    INTEGER NOT NULL,
  informationtype_id           INTEGER NOT NULL,
--   CONSTRAINT FK_PURPOSE FOREIGN KEY (purpose_id) REFERENCES POLICY_SCHEMA.PURPOSE (purpose_id),
--   CONSTRAINT FK_POLICY FOREIGN KEY (policy_id) REFERENCES POLICY_SCHEMA.POLICY (policy_id),
  CONSTRAINT FK_INFORMATIONTYPE_ID FOREIGN KEY (informationtype_id) REFERENCES BACKEND_SCHEMA.INFORMATIONTYPE (informationtype_id)
);