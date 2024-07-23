UPDATE DP_PROCESS
SET DATA = jsonb_set(DATA, '{dpProcessNumber}',  nextval('dp_process_number')::text::jsonb, true);