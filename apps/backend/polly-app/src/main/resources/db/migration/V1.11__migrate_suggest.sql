update information_type
set data = jsonb_set(data, '{suggest}', to_jsonb((data ->> 'name') || ' ' || (data ->> 'keywords') || ' ' || (data ->> 'description')));