update process
set data = jsonb_set(
        jsonb_set(data,
                  '{purposes}', jsonb_build_array(purpose_code)
            ),
        '{name}', to_jsonb(name)
    );

update policy
set data = jsonb_set(data, '{purposes}', jsonb_build_array(purpose_code));

alter table policy
    drop column purpose_code;

alter table process
    drop column purpose_code,
    drop column name;