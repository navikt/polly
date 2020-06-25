update information_type
set data = jsonb_set(data, '{orgMaster}', data #> '{navMaster}')
    - 'navMaster';