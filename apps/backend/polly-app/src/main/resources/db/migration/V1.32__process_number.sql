create sequence process_number minvalue 101 no cycle;

update process
set data = jsonb_set(data, '{number}', to_jsonb(nextval('process_number')));