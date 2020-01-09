update codelist set list_name = 'THIRD_PARTY' where list_name = 'SOURCE';
update audit_version set table_id = replace(table_id, 'SOURCE-', 'THIRD_PARTY-') where table_id like 'SOURCE-%';
