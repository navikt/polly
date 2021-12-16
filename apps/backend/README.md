[![Backend](https://github.com/navikt/polly/workflows/Backend/badge.svg?branch=master)](https://github.com/navikt/polly/actions)

## Kom i gang
Prosjektet krever maven og java 17

#####For å bygge

``mvn clean install``

#####For å kjøre lokalt
Start postgres med `docker-compose up -d postgres`
og bruk ``no.nav.data.polly.LocalAppStarter``

Swagger-dokumentasjon av tjenestene er tilgjenglig på http://localhost:8080/swagger-ui.html


## Libraries

* Java
* Spring web
* Spring data (jpa/hibernate/flyway)
* Postgresql (jsonb)
* Spring security/oauth2
* Microsoft graph/msal4j
* Lombok
* Spring test
* Wiremock


### low pri

* Caffeine cache
* Springdoc-openapi (swagger+)
* Prometheis metrics
* Docx4j (export til word/excel)
* Freemarker (epost maler)
* Testcontainers
