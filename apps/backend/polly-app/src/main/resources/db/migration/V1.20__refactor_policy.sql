alter table process_distribution
    drop column process,
    drop column purpose_code,
    add column data jsonb;

delete
from process_distribution;


alter table policy
    add column data jsonb;

update policy
set data = jsonb_build_object(
        'start', start_date,
        'end', end_date,
        'subjectCategories', subject_categories,
        'legalBases', legal_bases,
        'legalBasesInherited', legal_bases_inherited
    );

alter table policy
    alter column data SET not null;

alter table policy
    drop column start_date,
    drop column end_date,
    drop column subject_categories,
    drop column legal_bases,
    drop column legal_bases_inherited;
