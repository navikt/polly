[![CircleCI](https://circleci.com/gh/navikt/data-catalog-backend.svg?style=svg)](https://circleci.com/gh/navikt/data-catalog-backend)

# NAV Information catalog
Applikasjonen er en del av Datakatalog - prosjektet som skal levere en katalog over datasett i NAV
, til hvilke formål disse datasettene brukes, og hvilket rettslig grunnlag som ligger til grunn for bruken.

Applikasjonen data-catalog-backend samler all funksjonalitet knyttet til Datasett. Et datasett representerer en logisk 
gruppering av sammenhørende data. Applikasjonen inneholder også kodeverk som benttes av alle applikasjoner i Datakatalog-prosjektet

## Kom i gang
Prosjektet krever maven og java 11

#####For å bygge

``mvn clean install``

#####For å kjøre lokalt
Start postgres og elasticsearch med `docker-compose up -d elasticsearch postgres`
og bruk ``no.nav.data.catalog.backend.app.LocalAppStarter``

Swagger-dokumentasjon av tjenestene er tilgjenglig på http://localhost:8080/backend/swagger-ui.html