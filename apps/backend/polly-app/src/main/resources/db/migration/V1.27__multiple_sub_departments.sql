update process
set data = jsonb_set(data, '{subDepartments}',
                     case
                         when data ->> 'subDepartment' is not null
                             then jsonb_build_array(data ->> 'subDepartment')
                         else '[]'::jsonb end
               )
    - 'subDepartment';