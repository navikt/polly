# NAV Information catalog
Applikasjonen er en del av Datakatalog - prosjektet som skal levere en katalog over datasett i NAV
, til hvilke formål disse datasettene brukes, og hvilket rettslig grunnlag som ligger til grunn for bruken.

Applikasjonen data-catalog-backend samler all funksjonalitet knyttet til Datasett. Et datasett representerer en logisk 
gruppering av sammenhørende data. Applikasjonen inneholder også kodeverk som benttes av alle applikasjoner i Datakatalog-prosjektet

## Kom i gang
Prosjektet krever maven og java 11

For å bygge

``mvn clean install``

For å kjøre, navigèr til ``data-catalog-backend-app`` og kjør

``mvn exec:java -Dspring.profiles.active=test``

Swagger-dokumentasjon av tjenestene er tilgjenglig på
http://localhost:8081/swagger-ui.html