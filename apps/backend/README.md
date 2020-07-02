[![Backend](https://github.com/navikt/polly/workflows/Backend/badge.svg?branch=master)](https://github.com/navikt/polly/actions)

## Kom i gang
Prosjektet krever maven og java 14

#####For å bygge

``mvn clean install``

#####For å kjøre lokalt
Start postgres med `docker-compose up -d postgres`
og bruk ``no.nav.data.polly.LocalAppStarter``

Swagger-dokumentasjon av tjenestene er tilgjenglig på http://localhost:8080/swagger-ui.html