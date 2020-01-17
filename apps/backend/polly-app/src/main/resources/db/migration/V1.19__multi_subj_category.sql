-- Update document from list of informationTypeIds to list of objects with Id

with pre as (select document_id, jsonb_agg(jsonb_build_object('informationTypeId', info_type.id)) as info_types
             from document,
                  jsonb_array_elements_text(data -> 'informationTypeIds') as info_type (id)
             group by document_id)
update document
set data = jsonb_build_object(
        'name', data -> 'name',
        'description', data -> 'description',
        'informationTypes',
        (select info_types from pre where pre.document_id = document.document_id)
    );