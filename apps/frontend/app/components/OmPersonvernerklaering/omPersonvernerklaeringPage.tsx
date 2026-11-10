'use client'

import { BodyLong, Heading, List, Radio, RadioGroup } from '@navikt/ds-react'
import RouteLink from '@/components/common/RouteLink'
import { TConsentValue } from '@/util/analytics/innblikk'
import { useConsent } from '@/util/analytics/useConsent'

const OmPersonvernerklaeringPage = () => {
  const { consent, setConsent } = useConsent()

  const handleConsentChange = (value: TConsentValue) => {
    setConsent(value)
  }

  return (
    <div className='flex gap-7 mt-10'>
      <div className='max-w-[75ch]'>
        <Heading spacing size='large' level='1'>
          Personvernerklæring for Behandlingskatalogen
        </Heading>
        <BodyLong spacing>
          Denne personvernerklæringen beskriver hvordan Arbeids- og velferdsetaten ved Team
          Datajegerne behandler dine personopplysninger som ansatt ved bruk av Behandlingskatalogen.
        </BodyLong>

        <Heading size='medium' level='2' spacing>
          Kort om Behandlingskatalogen
        </Heading>
        <BodyLong className='mb-3'>
          Nav er pålagt å holde protokoll over alle behandlingsaktiviteter. Ansatte i Nav skal
          dokumentere dette i Behandlingskatalogen. I Behandlingskatalogen er det registrert både
          aktive og utgåtte behandlingsaktiviteter.
        </BodyLong>
        <BodyLong className='mb-3'>
          I tillegg til oversikt over behandlingsaktiviteter der Nav er behandlingsansvarlig, holdes
          det også oversikt over:
        </BodyLong>
        <List className='mb-6'>
          <List.Item>Behandlinger der Nav er databehandler</List.Item>
          <List.Item>Databehandlere som benyttes i behandlingene</List.Item>
          <List.Item>
            Oversikt over utleveringer av personopplysninger til andre virksomheter
          </List.Item>
          <List.Item>Systemer som benyttes i behandlingene</List.Item>
          <List.Item>Opplysningstyper som behandles</List.Item>
        </List>

        <Heading size='medium' level='2' spacing>
          Hvordan behandler vi personopplysninger i Behandlingskatalogen?
        </Heading>
        <BodyLong className='mb-3'>
          Den rettslige forpliktelsen til å ha protokoll over alle behandlingsaktiviteter, er
          grunnlaget for behandlingen av de ansattes personopplysninger, jf. personvernforordningens
          artikkel 6(1)c.
        </BodyLong>
        <BodyLong className='mb-3'>
          Opplysninger som behandles er navn, Nav-ident og e-postadresse til deg som:
        </BodyLong>
        <List className='mb-6'>
          <List.Item>Registrerer og endrer behandlingsaktiviteter </List.Item>
          <List.Item>Registrerer eller endrer opplysningstyper</List.Item>
          <List.Item>Avtaleeiere og fagansvarlige av databehandleravtale</List.Item>
        </List>

        <Heading size='medium' level='2' spacing>
          Hvor henter vi dine personopplysninger?
        </Heading>
        <BodyLong className='mb-6'>
          Vi henter opplysninger om deg som ansatt fra Navs organisasjonsmaster (NOM).
        </BodyLong>

        <Heading size='medium' level='2' spacing>
          Hvor behandler og lagrer vi personopplysningene?
        </Heading>
        <BodyLong spacing>
          Vi behandler og lagrer personopplysninger om deg i Behandlingskatalogen, Google Cloud
          Platform og Azure.
        </BodyLong>
        <BodyLong className='mb-6'>
          For utfyllende informasjon om hvordan vi behandler personopplysninger kan du lese mer i{' '}
          <RouteLink href='https://behandlingskatalog.ansatt.nav.no/process/purpose/ETTERLEVELSE/608fdba9-ba47-4c86-878b-f229591ae1ba?'>
            Behandlingskatalogen
          </RouteLink>{' '}
          og i{' '}
          <RouteLink href='https://navno.sharepoint.com/sites/intranett-hr/SitePages/Personvernerkl%C3%A6ring.aspx?web=1'>
            Personvernerklæring for ansatte i Arbeids- og velferdsetaten
          </RouteLink>
          .
        </BodyLong>

        <Heading size='medium' level='2' spacing>
          Innblikk i Behandlingskatalogen
        </Heading>
        <BodyLong spacing>
          Vi bruker statistikk- og analyseverktøyet Innblikk for å forstå hvordan ansatte bruker
          Behandlingskatalogen. Formålet er å forbedre brukeropplevelsen i løsningen. Innblikk
          bruker ikke informasjonskapsler, men henter inn opplysninger om nettleseren din for å lage
          en unik ID («finger printing»). Denne ID-en brukes for å skille deg fra andre brukere. For
          å hindre identifisering, fjernes deler av IP-adressen din før dataene sendes til Innblikk.
        </BodyLong>
        <BodyLong className='mb-3'>Med Innblikk måler vi:</BodyLong>
        <List className='mb-6'>
          <List.Item>antall besøk på ulike sider</List.Item>
          <List.Item>varigheten på besøkene</List.Item>
          <List.Item>hvordan ansatte navigerer mellom de ulike sidene</List.Item>
          <List.Item>hvilke knapper som trykkes på og når</List.Item>
        </List>
        <BodyLong className='mb-3'>Med Innblikk måler vi ikke:</BodyLong>
        <List className='mb-6'>
          <List.Item>inndata i fritekstboks og søkefelt</List.Item>
          <List.Item>
            andre felter som kan inneholde personopplysninger eller pseudonymiserte
            personopplysninger
          </List.Item>
        </List>
        <BodyLong className='mb-6'>
          For mer generell informasjon, se{' '}
          <RouteLink href='https://navno.sharepoint.com/sites/intranett-utvikling/SitePages/Rutine-for-bruk-av-Umami.aspx'>
            Rutine for bruk av Innblikk
          </RouteLink>
          .
        </BodyLong>

        <Heading size='medium' level='2' spacing>
          Samtykke om måling
        </Heading>
        <BodyLong spacing>
          Selv om det ikke behandles personopplysninger, har ansatte likevel anledning til å
          samtykke til målingen. Første gang vises det et informasjonskapsel-banner (også kalt
          cookie-banner) i nettsiden, der det henvises til denne personvernerklæringen. I samme
          banner er det også anledning til å godta eller avvise. Dette banneret vil dukke opp på
          nytt hver 6. måned.
        </BodyLong>
        <BodyLong spacing>
          Nederst på nettsiden Behandlingskatalogen vil også lenke til personvernerklæringen alltid
          være tilgjengelig, I personvernerklæringen kan du alltid endre samtykket.
        </BodyLong>

        <RadioGroup
          className='mb-6'
          legend='Samtykke til måling med Innblikk'
          value={consent}
          onChange={handleConsentChange}
          name='samtykkeTilInnblikk'
        >
          <Radio value='accepted'>Godkjenn bruk av Innblikk</Radio>
          <Radio value='rejected'>Ikke godkjenn bruk av Innblikk</Radio>
        </RadioGroup>

        <Heading size='medium' level='2' spacing>
          Feil, mangler og tilbakemeldinger
        </Heading>
        <BodyLong className='mb-3'>
          Har du tilbakemeldinger til Støtte til etterlevelse, oppfordrer vi deg til å ta kontakt
          med Team Datajegerne:
        </BodyLong>
        <List className='mb-6'>
          <List.Item>Bli med på #behandlingskatalogen på Slack</List.Item>
          <List.Item>Send mail til: teamdatajegerne@nav.no</List.Item>
        </List>
      </div>
    </div>
  )
}

export default OmPersonvernerklaeringPage
