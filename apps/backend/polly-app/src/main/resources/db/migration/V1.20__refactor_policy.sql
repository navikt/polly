alter table process_distribution
    drop column process,
    drop column purpose_code,
    add column data jsonb;

delete from process_distribution;