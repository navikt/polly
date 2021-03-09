# Sql queries

#### Innhenting av data fra eksterne parter

```postgresql
select c.short_name       ekstern_part,
       it.data ->> 'name' opplysningstype
from codelist c
         join information_type it on data -> 'sources' ? c.code
where c.list_name = 'THIRD_PARTY'
order by ekstern_part, opplysningstype;
```

#### Utlevering av data til eksterne parter

```postgresql
-- direct connections
select ekstern_part,
       (select data ->> 'name' from information_type it where information_type_id = infoTypes::uuid)
from (
         select (select short_name from codelist where code = data ->> 'recipient') ekstern_part,
                jsonb_array_elements_text(data -> 'informationTypeIds')             infoTypes
         from disclosure d) sub;

-- via document
select thirdParty,
       (select data ->> 'name' from information_type it where information_type_id = (documentInfoTypes ->> 'informationTypeId')::uuid)
from (
         select (select short_name from codelist where code = data ->> 'recipient')                                                         thirdParty,
                jsonb_array_elements((select data -> 'informationTypes' from document where document_id = (d.data ->> 'documentId')::uuid)) documentInfoTypes
         from disclosure d) sub;
```

#### Opptelling av innhenting og utlevering

```postgresql
select short_name                                                             ekstern_part,
       (select count(1) from disclosure where data ->> 'recipient' = code)    utlevering,
       (select count(1) from information_type where data -> 'sources' ? code) innhenting
from codelist
where list_name = 'THIRD_PARTY';
```
