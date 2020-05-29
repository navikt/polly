update process
set data = jsonb_set(data, '{productTeams}',
                     case
                         when data ->> 'productTeam' is not null
                             then jsonb_build_array(data ->> 'productTeam')
                         else '[]'::jsonb end
               )
    - 'productTeam';