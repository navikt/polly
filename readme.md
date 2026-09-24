[![CodeQL](https://github.com/navikt/polly/actions/workflows/github-code-scanning/codeql/badge.svg?branch=master)](https://github.com/navikt/polly/actions/workflows/github-code-scanning/codeql)

[![Dependabot Updates](https://github.com/navikt/polly/actions/workflows/dependabot/dependabot-updates/badge.svg?branch=master)](https://github.com/navikt/polly/actions/workflows/dependabot/dependabot-updates)

[![Backend](https://github.com/navikt/polly/actions/workflows/backend.yml/badge.svg?branch=master)](https://github.com/navikt/polly/actions/workflows/backend)
[![Frontend](https://github.com/navikt/polly/actions/workflows/frontend.yml/badge.svg)](https://github.com/navikt/polly/actions/workflows/frontend)

Url for løsningen:

- prod: https://polly.ansatt.nav.no/
- dev: https://polly.intern.dev.nav.no

Når du tar en `git clone` må du velge `https`. Hvis du velger `ssh`, så vil `nais` klage på at du har en `ssh`-nøkkel på maskinen din, som vil medføre at du mister tilgang til `nais` ved at `azure` innlogging sier at innlogging var vellykket, men allikevel har du ikke tilgang.

# NAV Policy And Information catalog

Applikasjonen er en del av Datakatalog - prosjektet som skal levere en katalog over datasett i NAV
, til hvilke formål disse datasettene brukes, og hvilket rettslig grunnlag som ligger til grunn for bruken.

Applikasjonen polly samler all funksjonalitet knyttet til informasjonstyper og policies. En informasjonstype representerer en logisk
gruppering av sammenhørende data. Applikasjonen inneholder også kodeverk som benttes av alle applikasjoner i Datakatalog-prosjektet
