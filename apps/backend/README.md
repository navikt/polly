[![CircleCI](https://circleci.com/gh/navikt/polly.svg?style=svg)](https://circleci.com/gh/navikt/polly)

# NAV Policy And Information catalog
Applikasjonen er en del av Datakatalog - prosjektet som skal levere en katalog over datasett i NAV
, til hvilke formål disse datasettene brukes, og hvilket rettslig grunnlag som ligger til grunn for bruken.

Applikasjonen polly samler all funksjonalitet knyttet til informasjonstyper og policies. En informasjonstype representerer en logisk 
gruppering av sammenhørende data. Applikasjonen inneholder også kodeverk som benttes av alle applikasjoner i Datakatalog-prosjektet

## Kom i gang
Prosjektet krever maven og java 11

#####For å bygge

``mvn clean install``

#####For å kjøre lokalt
Start postgres med `docker-compose up -d postgres`
og bruk ``no.nav.data.polly.LocalAppStarter``

Swagger-dokumentasjon av tjenestene er tilgjenglig på http://localhost:8080/swagger-ui.html