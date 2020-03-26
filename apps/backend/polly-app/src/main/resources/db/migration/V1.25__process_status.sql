update process
set data = jsonb_set(data, '{status}', '"IN_PROGRESS"'::jsonb, true)