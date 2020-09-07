update process
set data = jsonb_set(
                   data, '{affiliation}',
                   jsonb_build_object(
                           'department', data -> 'department',
                           'subDepartments', data -> 'subDepartments',
                           'productTeams', data -> 'productTeams',
                           'products', data -> 'products'
                       )
               )
    - 'department'
    - 'subDepartments'
    - 'productTeams'
    - 'products'
;